const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { GuildQueuePlayerNode } = require("discord-player")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays info about the currently playing song"),
    run: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        let guildPlayerNode = new GuildQueuePlayerNode(queue)
        let bar = guildPlayerNode.createProgressBar({
            queue: false,
            length: 19
        })

        const song = queue.currentTrack

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail(song.thumbnail)
                    .setDescription(`Currently playing [${song.title}](${song.url})\n\n` + bar)
            ]
        })
    }
}