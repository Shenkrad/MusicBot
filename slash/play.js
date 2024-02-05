const { SlashCommandBuilder } = require("@discordjs/builders")
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Loads song from youtube")
        .addSubcommand((subcommand)=>
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option => option.setName("url").setDescription("the song's url").setRequired(true)))
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a url")
                .addStringOption((option)=> option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Searches for song based on provided keywords")
                .addStringOption((option)=>option.setName("searchterms").setDescription("the search keyworkds").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("dimsum")
                .setDescription("Plays dimsum paradise forever")
        ),
        run: async ({ client, interaction }) => {
            if (!interaction.member.voice.channel)
                return interaction.editReply("You need to be in a VC to use this command")

            const queue = await client.player.nodes.create(interaction.guild)
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new EmbedBuilder()

            if (interaction.options.getSubcommand() === "song"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })

                if (result.tracks.length === 0)
                    return interaction.editReply("No results")

                const song = result.tracks[0]

                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}` })

            }else if (interaction.options.getSubcommand() === "playlist"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })

                if (result.tracks.length === 0)
                    return interaction.editReply("No results")

                const playlist = result.playlist

                try{
                    await queue.addTrack(result.tracks)
                        embed
                            .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to the Queue`)
                            .setThumbnail(playlist.thumbnail)
                }catch(e){
                    return interaction.editReply("Not a valid playlist")
                }
                
            }else if (interaction.options.getSubcommand() === "search"){
                let url = interaction.options.getString("searchterms")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE
                })

                if (result.tracks.length === 0)
                    return interaction.editReply("No results")

                const song = result.tracks[0]

                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}` })
            }else if (interaction.options.getSubcommand() === "dimsum"){
                let url = "https://www.youtube.com/shorts/le5a8GGhyds"
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE
                })

                if (result.tracks.length === 0)
                    return interaction.editReply("No results")

                const song = result.tracks[0]
                if (queue.isPlaying) queue.clear()

                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}` })
                
                // setting track to repeat
                queue.setRepeatMode(1)
                
            }
            

            if (!queue.isPlaying()) await queue.node.play()
            await interaction.editReply({
                embeds: [embed]
            })
        }
}