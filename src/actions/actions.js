import { SET_VIEW_MODE, SET_USER, SET_EVENTS, SET_LIST_VIEW } from './actions-types';

const onViewModeChange = (mode) => ({ type: SET_VIEW_MODE, mode });
const onSetUser = (user) => ({ type: SET_USER, user });
const onSetEvents = (events) => ({ type: SET_EVENTS, events });
const onSetListView = ({ target: { value } }) => ({ type: SET_LIST_VIEW, listView: value });

export { onViewModeChange, onSetUser, onSetEvents, onSetListView };
