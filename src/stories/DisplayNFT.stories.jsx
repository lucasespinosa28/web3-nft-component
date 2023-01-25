import React from "react";
import { NFTMetadata } from "../components/NFTMetadata";

export default {
	title: "NFT",
	component: NFTMetadata,
};

const Template = (args) => <NFTMetadata chainName="Ethereum" {...args} />;

export const Video = Template.bind({});
Video.args = {
	chainId: "1",
	contractAddress: "0x7c3e8096b70a4ddc04c4344b8f33b97c9d12bc4e",
	tokenId: "1",
	animated: true,
	audio: false,
	description: true,
	attributes: true,
	markeplaces: ["opensea", "rarible"],
};

export const Image = Template.bind({});
Image.args = {
	chainId: "1",
	size: "512",
	contractAddress: "0x7c3e8096b70a4ddc04c4344b8f33b97c9d12bc4e",
	tokenId: "4224",
	animated: false,
	audio: false,
	description: true,
	attributes: true,
	markeplaces: ["opensea", "rarible"],
};

export const Music = Template.bind({});
Music.args = {
	chainId: "1",
	contractAddress: "0x8390b5d7e3be0b166d97f49e3fac40a7548dfc33",
	tokenId: "123",
	size: "512",
	animated: false,
	audio: true,
	description: true,
	attributes: true,
	markeplaces: ["opensea", "rarible"],
};

export const Error = Template.bind({});
Error.args = {
	chainId: "1",
	contractAddress: "0x833jkljdasdas48dfc33",
	tokenId: "100000000",
	animated: false,
	audio: true,
	description: true,
	attributes: true,
	markeplaces: ["opensea", "rarible"],
};
