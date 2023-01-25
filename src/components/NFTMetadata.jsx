import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Opensea, Rarible } from "./Icons";
import {
	Card,
	Collapse,
	Descriptions,
	Typography,
	Col,
	Divider,
	Row,
	Alert,
} from "antd";
const { Title, Paragraph, Link } = Typography;
import { getDataFromCovalentAPILogin } from "../utils/api";

const { Panel } = Collapse;

function MarkeplacesLinks({ marketplace, contract, id }){
	if(marketplace === 0) return null;
	return (<div style={{ marginTop: 15 }}>
		{marketplace.find((element) => element == "opensea") && (
			<Link
				style={{ paddingLeft: 8 }}
				href={`https://opensea.io/assets/ethereum/${contract}/${id}`}
				target="_blank"
			>
				<Opensea />
			</Link>
		)}
		{marketplace.find((element) => element == "rarible") && (
			<Link
				style={{ paddingLeft: 8 }}
				href={`https://rarible.com/token/${contract}:${id}`}
				target="_blank"
			>
				<Rarible />
			</Link>
		)}
	</div>);
}

function ImageSize(size, data) {
	switch (size) {
	case "256":
		return data.image_256;
	case "512":
		return data.image_512;
	case "1024":
		return data.image_1024;
	default:
		return data.image;
	}
}

export function NFTMetadata({
	chainId,
	chainName,
	contractAddress,
	tokenId,
	size,
	animated,
	audio,
	description,
	attributes,
	markets,
	blockExplorer,
}) {
	if (animated) audio = false;
	if (audio) animated = false;

	const [data, getData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (contractAddress) {
			fetchData();
		}
	}, [contractAddress, tokenId]);

	const fetchData = () => {
		setError(false);
		setIsLoading(true);
		const URL = `https://api.covalenthq.com/v1/${chainId}/tokens/${contractAddress}/nft_metadata/${tokenId}/?format=JSON`;
		getDataFromCovalentAPILogin(URL)
			.then((response) => {
				setIsLoading(false);
				getData(response.data.items[0]);
			})
			.catch(() => setError(true));
	};

	function external_url(url) {
		return url == null
			? `https://opensea.io/assets/${chainName}/${contractAddress}/${tokenId}`
			: url;
	}
	if (error) {
		return (
			<Card style={{ width: "100%" }}>
				<Alert
					message="Error"
					description="Unable to fetch data"
					type="error"
					showIcon
				/>
			</Card>
		);
	} if (isLoading && data == null) {
		return <Card loading={true} />;
	} if (!isLoading && data != null) {
		return (
			<Card
				title={
					<Link
						href={external_url(data.nft_data[0].external_data.external_url)}
						target="_blank"
					>
						<Title
							level={3}
						>{`${data.contract_name} - ${data.nft_data[0].external_data.name}`}</Title>
					</Link>
				}
				extra={
					<MarkeplacesLinks
						marketplace={markets}
						contract={contractAddress}
						id={tokenId}
					/>
				}
				style={{
					width: "100%",
				}}
				cover={
					!animated ? (
						<img src={ImageSize(size, data.nft_data[0].external_data)} />
					) : (
						<video
							src={data.nft_data[0].external_data.animation_url}
							autoPlay={true}
							loop={true}
							controls={true}
						/>
					)
				}
			>
				<Row justify="center">
					<Col>
						{audio && (
							<audio
								src={data.nft_data[0].external_data.animation_url}
								controls={true}
							/>
						)}
					</Col>
				</Row>
				{description && (
					<>
						<Divider>Description</Divider>
						<Paragraph>{data.nft_data[0].external_data.description}</Paragraph>
						<Divider></Divider>
					</>
				)}

				{attributes && (
					<Collapse defaultActiveKey={["1"]}>
						<Panel header="Attributes" key="1">
							<Descriptions bordered>
								{data.nft_data[0].external_data.attributes.map(
									(attribute, index) => {
										return (
											<Descriptions.Item key={`${attribute.trait_type}-${index}`}label={attribute.trait_type}>
												{attribute.value}
											</Descriptions.Item>
										);
									},
								)}
							</Descriptions>
						</Panel>
					</Collapse>
				)}
				<Divider plain></Divider>
				<Link
					href={blockExplorer.replace("$contract", data.contract_address)}
					target="_blank"
				>
					Contract - {data.contract_address}
				</Link>
			</Card>
		);
	}
}
MarkeplacesLinks.propTypes = {
	marketplace: PropTypes.array,
	contract: PropTypes.string,
	id: PropTypes.string,
};
NFTMetadata.propTypes = {
	chainId: PropTypes.string,
	chainName: PropTypes.string,
	contractAddress: PropTypes.string,
	tokenId: PropTypes.string,
	size: PropTypes.oneOf(["256", "512", "1024", "default"]),
	animated: PropTypes.bool,
	audio: PropTypes.bool,
	description: PropTypes.bool,
	attributes: PropTypes.bool,
	markets: PropTypes.array,
	blockExplorer: PropTypes.string,
};

NFTMetadata.defaultProps = {
	chainId: 1,
	chainName: "Ethereum",
	size: "default",
	animated: false,
	audio: false,
	name: true,
	description: true,
	attributes: true,
	markets: ["opensea", "rarible"],
	blockExplorer: "https://etherscan.io/token/$contract",
};
