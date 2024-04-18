import {
    isProfane
} from 'no-profanity';

function checkProfanity(text) {
    return isProfane(text);
}

export {
    checkProfanity
};
