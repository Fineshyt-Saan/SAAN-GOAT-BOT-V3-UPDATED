module.exports = {
	config: {
		name: "mention",
		version: "1.2",
		author: "Siam Ahmed Saan",
		role: 0,
		shortDescription: {
			en: "Reply when specific user is mentioned"
		},
		category: "owner"
	},

	onStart: async function () {},

	onChat: async function ({ api, event }) {
		const bossUIDs = [
			"100075454605535",
			"61577714644176"
		];

		if (!event.mentions || typeof event.mentions !== "object")
			return;

		const mentionedIDs = Object.keys(event.mentions);

		if (mentionedIDs.some(uid => bossUIDs.includes(uid))) {
			return api.sendMessage(
				"Boss ekhon busy ache free hoye reply dibe 🫠🌷",
				event.threadID,
				event.messageID
			);
		}
	}
};
