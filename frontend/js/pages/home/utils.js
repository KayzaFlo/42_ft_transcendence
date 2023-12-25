import { fetchFriendChange, fetchUser } from '../../api/fetchData.js';
import { assembler } from '../../api/assembler.js';
import { updateOtherFriendButton, updateStatusMsg } from './otherUserProfile.js';
import { updateSocial, updateSocialFriendCard } from './social.js';
import interactiveSocket from './socket.js';
import { userTemplateComponent } from '../../components/userTemplate/userTemplate.js';
import { fillOtherUserInfo } from './leftColumn.js';
import { displayOtherUserProfile } from './otherUserProfile.js';
import { displayToast } from './toastNotif.js';
import { displayAlertMsg } from '../../utils/utilityFunctions.js';

export async function handleFriendAction(actionObj) {
    const actionToMethod = {
        'add': 'POST',
        'cancel': 'DELETE',
        'accept': 'POST',
        'refuse': 'DELETE',
        'unfriend': 'DELETE',
    };

    if (!actionObj) {
        console.error('No actionObj');
        return;
    }

    const { id: userID, action, modal } = actionObj;
    if (!action || !actionToMethod[action]) {
        console.error(`Unknown action: ${action}`);
        return;
    }

    const apiParam = { id: userID, action };
    const method = actionToMethod[action];
    const response = await fetchFriendChange(method, apiParam);
    if (!response) {
        return;
    }
    if (response.status >= 200 && response.status < 300) {
        interactiveSocket.sendMessageSocket(JSON.stringify({"type": "Social", "rType": action, "other_user_id": userID}));
    }
    const assemble = await assembler(response);
    const responseStatus = response.status;
    switch (modal) {
        case 'otherProfile':
            updateStatusMsg(assemble, responseStatus);
            if (assemble.status) {
                updateOtherFriendButton(assemble.status);
            }
            break;
        case 'social':
            updateSocialFriendCard(userID, action, responseStatus, assemble);
            break;
        default:
            console.error(`Unknown modal type: ${modal}`);
    }
}

async function addNewUser(user) {
    const everyoneContainer = document.getElementById('userDisplay');
    const friendContainer = document.getElementById('friendDisplay');
    const templateUser = await getTemplateUser(user);

    if (!templateUser) return;

    const seeProfileBtn = templateUser.querySelector('.card');
    seeProfileBtn.addEventListener('click', displayOtherUserProfile)
    appendToContainer(everyoneContainer, templateUser, user.id);
    if (await checkIfFriend(user)) {
        await changeFriendStatus(user.id, friendContainer, templateUser);
    }
}

async function changeFriendStatus(userID, container, templateUser) {
    const friendCard = container.querySelector(`div[data-id="${userID}"]`);

    if (friendCard) {
        updateBadgeColor(friendCard, container);
    } else {
        prependToContainer(container, templateUser.cloneNode(true), userID);
    }
}

function updateBadgeColor(friendCard, container) {
    const statusBadge = friendCard.querySelector('#badge');
    if (statusBadge) {
        statusBadge.style.backgroundColor = setStatus('ONL');
        container.removeChild(friendCard);
        container.insertBefore(friendCard, container.firstChild);
    }
}

function appendToContainer(container, element, userID) {
    if (!container.querySelector(`div[data-id="${userID}"]`)) {
        element.setAttribute('data-id', userID);
        container.appendChild(element);
    } else {
        console.log(`User with ID ${userID} already exists in the container.`);
    }
}

function prependToContainer(container, element, userID) {
    element.setAttribute('data-id', userID);
    container.insertBefore(element, container.firstChild);
}

async function getTemplateUser(user) {
    const templateUser = await userTemplateComponent();
    if (!templateUser) {
        console.error('Cannot find templateUser');
        return null;
    }
    return fillOtherUserInfo(templateUser, user);
}

async function checkIfFriend(user) {
    const response = await fetchFriendChange('GET', { id: user.id });
    if (!response) return false;
    
    const friendStatus = await assembler(response);
    return friendStatus && friendStatus.state === 'friend';
}


function updateOtherUsers(user) {
    const userCards = document.querySelectorAll(`div[data-id="${user.id}"]`);
    userCards.forEach(card => {
        const avatarElement = card.querySelector('#user-avatar');
        const nameElement = card.querySelector('#user-name');

        if (avatarElement) {
            avatarElement.src = user.avatar; // Update avatar image source
            avatarElement.alt = user.nickname; // Update alt text
        }
        if (nameElement) {
            nameElement.textContent = user.nickname; // Update user's name
        }
    });
}

export function setStatus(user) {
    switch (user) {
        case 'ONL':
            return 'green';
        case 'BUS':
            return 'red';
        case 'ING':
            return 'yellow';
        case 'OFF':
            return 'gray';
    }
}

export function getMyID() {
    let userID = sessionStorage.getItem('user_id');
    if (!userID) {
        const token = sessionStorage.getItem('jwt');
        if (token) {
            const parts = token.split('.');
            if (parts.length === 3) {
                try {
                    const decodedPayload = JSON.parse(atob(parts[1]));
                    userID = decodedPayload.sub;
                    sessionStorage.setItem('user_id', userID);
                } catch (e) {
                    console.error('Failed to decode JWT:', e);
                }
            }
        }
    }
    return userID;
}

//////////////////////////// SOCKET FUNCTIONS ////////////////////////////

// To use when user update his profile (avatar/nickname)
export async function updateSpecificUser(userID) {
    console.log("UPDATE USER")
    const apiParam = { id: userID };
    const response = await fetchUser('GET', apiParam);
    if (!response)
        return;
    const assemble = await assembler(response);
    if (typeof assemble !== 'object' || assemble === null) {
        console.log(assemble);
        return;
    } else {
        updateOtherUsers(assemble[0]);
    }
}

// To use when user login
export async function newUser(userID) {
    console.log("NEW USER")
    const apiParam = { id: userID };
    if (getMyID() == userID) 
        return;
    try {
        const response = await fetchUser('GET', apiParam);
        if (!response)
            return;
        
        const assemble = await assembler(response);
        if (typeof assemble !== 'object' || assemble === null) {
            console.log(assemble);
            return;
        }
        addNewUser(assemble[0]);
    } catch (error) {
        console.error('Error in newUser:', error);
    }
    console.log("END NEW USER")
}

// To use when user logout
export async function removeUser(userID) {
    console.log("REMOVE USER")
    const everyoneContainer = document.getElementById('userDisplay');
    const friendContainer = document.getElementById('friendDisplay');

    const userCards = document.querySelectorAll(`div[data-id="${userID}"]`);
    userCards.forEach(card => {
        if (everyoneContainer.contains(card)) {
            everyoneContainer.removeChild(card);
        } else if (friendContainer.contains(card)) {
            const statusBadge = card.querySelector('#badge');
            if (statusBadge) {
                statusBadge.style.backgroundColor = setStatus('OFF');
                friendContainer.removeChild(card);
                friendContainer.appendChild(card);
            }
        }
    });
    console.log("END REMOVE USER")
}

export function handleSocialUpdate(rType, currentUser, otherUserId) {
    const userId = getMyID();
    console.log("START SOCIAL UPDATE")
    if (!userId || userId == currentUser || userId == otherUserId) {
        console.log("IN IF")
        updateSocial();
        createNotifications(rType, userId, currentUser, otherUserId);
    }

    console.log("END SOCIAL UPDATE");
}

function createNotifications(rType, userId, otherUserId, currentUser) {
    let toastMsg = "";
    let toastTitle = "";
    let imgUrl = "https://www.shutterstock.com/image-vector/friends-request-icon-isolated-sign-260nw-1591730662.jpg";

    console.log("ID GOT: ", userId)
    console.log("user sent request: ", currentUser)
    console.log("user concern by request: ", otherUserId)
    console.log("rType: ", rType)
    switch (rType) {
        case "add":
            if (userId == currentUser) {
                // For the sender of the friend request
                toastMsg = "You have received a friend request!";
                toastTitle = "Friend Request";
            } else {
                return
            }
            break;
        case "accept":
            if (userId == currentUser) {
                toastMsg = "Your friend request was accepted!";
                toastTitle = "Request Accepted";
            } else
                return
            break;
        case "refuse":
            if (userId == currentUser) {
                toastMsg = "Your friend request has been refused.";
                toastTitle = "Request Refused";
            } else
                return;
            break;
        case "unfriend":
            if (userId == currentUser) {
                toastMsg = "You have been unfriended.";
                toastTitle = "Unfriended";
            } else {
                return
            }
            break;
        default:
            return; // Exit the function if rType is not recognized
    }
    displayToast(toastMsg, toastTitle, imgUrl);
}
