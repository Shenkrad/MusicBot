const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Switch queue loop modes")
        .addSubcommand((subcommand)=>
            subcommand
            .setName("song")
            .setDescription("Loops current song")
        )
        .addSubcommand((subcommand)=>
            subcommand
            .setName("queue")
            .setDescription("Loops the current queue")
        )
        .addSubcommand((subcommand)=>
            subcommand
            .setName("off")
            .setDescription("Switch off loop mode")
        )
        .addSubcommand((subcommand)=>
            subcommand
            .setName("autoplay")
            .setDescription("Play similar tracks in the future if queue is empty")
        ),
    run: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guildId)

        if (!queue) return await interaction.editReply("Can't loop and empty queue")

        if (interaction.options.getSubcommand() === "song"){
            queue.setRepeatMode(1)

            return interaction.editReply("Looping this song")

        }else if (interaction.options.getSubcommand() === "queue"){
            queue.setRepeatMode(2)

            return interaction.editReply("Looping the queue")

        }else if (interaction.options.getSubcommand() === "off"){
            queue.setRepeatMode(0)

            return interaction.editReply("Loop mode off")

        }else if (interaction.options.getSubcommand() === "autoplay"){
            queue.setRepeatMode(3)

            return interaction.editReply("Autoplay mode")
        }
        
    }
}