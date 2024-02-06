const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue"),
    run: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        let isShuffled = queue.toggleShuffle()
        if (isShuffled)
        {
            await interaction.editReply(`The queue of ${queue.tracks.size} songs have been shuffled!`)
        }else{
            await interaction.editReply(`The queue of ${queue.tracks.size} songs is ordered again!`)
        }
        
    }
}