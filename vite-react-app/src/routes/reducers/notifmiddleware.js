import { isFulfilled, isRejectedWithValue } from "@reduxjs/toolkit";
import { sendNotif } from "./notifSlice";

const MS_TO_CLOSE = 3000;
const context = {
    pending: "warning",
    fulfilled: "success",
    rejected: "danger",
};
const endpoints = {
  currentUser: 'user credentials',
  medias: 'retrieving medias',
  addMedia: 'added media',
  deleteMedia: 'deleted media',
  login: 'user login'
};
const skiplist = (endpointName, error) => {
  switch(endpointName) {
  case 'currentUser':
    if (!error) {
      return true;
    }
    break;
  case 'medias':
    if (!error) {
      return true;
    }
    break;
  default:
    return false;
  }
};
// central toast notifications
const notificationMiddleware =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        if (action.meta) {
            const {
                requestStatus = "",
                arg = { endpointName: '' },
            } = action.meta;
            if (!arg.endpointName || !action.payload || skiplist(arg.endpointName, action.payload.notif)) {
              return next(action)
            }
            dispatch(
              sendNotif({
                text: (isRejectedWithValue(action) || ( action.payload.notif))
                    ? `Error encountered with ${endpoints[arg.endpointName]} due to ${action.payload.message}`
                    :
                     `Successful ${endpoints[arg.endpointName]}`,
                context: (isRejectedWithValue(action) || ( action.payload.notif))
                    ? 'danger'
                    :
                    'success',
                ...((isRejectedWithValue(action) || (action.payload.notif))
                    ? {
                          neverFade: true,
                      }
                    : {
                          endpointName: arg.endpointName,
                          requestStatus,
                      }),
                ...((!isRejectedWithValue(action) && (!action.payload.notif))
                    ? { msToClose: MS_TO_CLOSE }
                    : {}),
              })
            );
        }
        return next(action);
    };

export default notificationMiddleware;