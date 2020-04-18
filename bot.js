const Discord = require("discord.js");
const Auth = require('./auth.json');
const Config = require('./config.json');

const client = new Discord.Client();

const maxQuestions = 100;

let answers;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    WipeAnswers();
});

client.on('message', msg => {
    if (IsCommand(msg.content)) {

        const params = msg.content.substring(1).split(' ');
        if(params.length < 1){
            return;
        }

        if(!Config.answerTextChannels.includes(msg.channel.name) && !Config.quizMasterTextChannels.includes(msg.channel.name)){
            return;
        }

        if(isNaN(parseInt(params[0]))){
            switch(params[0]){
                case 'help':
                    msg.reply(Config.helpText);
                    break;
                case 'admin':
                    if(Config.adminIds.includes(msg.member.id)){
                        if(params.length > 1){
                            if(params[1] == 'enable'){
                                msg.reply('Granting admin');
                                break;
                            }else if(params[1] == 'disable'){
                                msg.reply('Granting admin');
                                break;
                            }
                        }
                        break;
                    }
                case 'answers':
                    if(Config.quizMasterTextChannels.includes(msg.channel.name)){
                        if(params.length > 1 && answers[params[1]] != null){
                            msg.reply(GetAnswers(params[1]));
                        }else{
                            msg.reply('Possible teams are: ' + Config.answerTextChannels.join(', '));
                        }
                        break;
                    }
                case 'wipe':
                    if(Config.quizMasterTextChannels.includes(msg.channel.name)){
                        WipeAnswers();
                    }
                    break;
            }
        }else{
            if(Config.answerTextChannels.includes(msg.channel.name) && params.length > 1){
                if(parseInt(params[0]) > maxQuestions || parseInt(params[0]) < 0){
                    msg.reply('Max question number is ' + maxQuestions);
                }else{
                    const answer = params.slice(1, params.length).join(' ');

                    if(answers[msg.channel.name][parseInt(params[0])] == null){
                        msg.reply('Question ' + params[0] + '. ' + answer);
                    }else{
                        msg.reply('Question ' + params[0] + '. ~~' + answers[msg.channel.name][parseInt(params[0])] + '~~ ' + answer);
                    }

                    answers[msg.channel.name][parseInt(params[0])] = answer;
                }
            }
        }

    }
});

client.login(Auth.token);

function IsCommand(message){
    return message.substring(0, Config.commandPrefix.length) === Config.commandPrefix;
}

function GetAnswers(teamName){
    if(answers[teamName] != null){
        let output = '';

        for(let i = 0; i < answers[teamName].length; i++){
            output += i + '. ' + answers[teamName][i] + '\n'
        }

        return output;
    }else{
        return 'Failed to find team: ' + teamName;
    }
}

function WipeAnswers(){
    answers = {};
    Config.answerTextChannels.forEach(element => {
        answers[element] = [];
    });
}