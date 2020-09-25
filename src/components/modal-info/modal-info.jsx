import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Modal, Space, Typography, Button, Switch, Tooltip } from 'antd';
import { FormOutlined, ReadOutlined } from '@ant-design/icons';

import getEventColor from '../../utils/getEventColor';
import sortByDateTime from '../../utils/sortByDateTime';
import getFormattedDate from '../../utils/getFormattedDate';
import {
  feedbackButtonStyles,
  getOrganizerID,
  feedbackSwitchStyles,
} from '../../utils/modalInfoHelpers';

import { onSetEvents } from '../../actions/actions';

import Type from '../task-type';
import Links from '../links';
import Organizer from '../organizer/organizer';
import FeedbackContainer from '../feedback/feedback';
import MapContainer from '../map/map';

import { MODAL_INFO_TEXT, MENTOR } from '../../constants/constants';
import { ONLINE_TEXT } from '../../constants/mapConstants';
import {
  MENTOR_SHOW_FEEDBACKS_TEXT,
  STUDENT_ADD_FEEDBACK_TEXT,
} from '../../constants/modalInfoConstants';

import SwaggerService from '../../services/swagger-service';

import './modal-info.scss';

const api = new SwaggerService();

const {
  noInfo,
  estimatedWeek,
  taskType,
  taskStart,
  taskDeadline,
  estimatedStudyTime,
  taskPlace,
  taskDescription,
  taskLinks,
  taskOrganizer,
  taskComment,
  taskName,
} = MODAL_INFO_TEXT;

const ModalInfo = ({
  eventDescription,
  displayModal,
  setDisplayModal,
  eventColors,
  currentTimezone,
  fontSize,
  titleTextSize,
  role,
  onFetch,
}) => {
  const {
    name = noInfo,
    week = noInfo,
    type = [],
    dateTime,
    deadline,
    estimatedTime = noInfo,
    place = noInfo,
    description = noInfo,
    descriptionUrl = null,
    links = {},
    organizer = [],
    comment = noInfo,
    allowFeedback = true,
    feedbacks = {},
  } = eventDescription;
  const { Link } = Typography;
  const getTypeTaskTags = () => <Type {...{ type, eventColors, fontSize }} />;
  const getLinks = () => <Links {...{ links }} />;
  const getOrganizer = () => <Organizer {...{ organizer }} />;
  const getTopic = () => (
    <Link href={descriptionUrl} target="_blank">
      {name}
    </Link>
  );
  const startDate = getFormattedDate(dateTime, currentTimezone) || noInfo;
  const deadlineDate = getFormattedDate(deadline, currentTimezone) || noInfo;
  const isOfflineEvent = place !== ONLINE_TEXT && place;

  const isMentor = role === MENTOR;

  const [displayFeedbackModal, setDisplayFeedback] = useState(false);
  const [updatedEvent, setUpdateEvents] = useState(eventDescription);
  const [isNeedToUpdate, setNeedToUpdate] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState(feedbacks);

  const onFeedbackBtnClick = () => {
    setDisplayFeedback(true);
  };

  const toggleAllowFeedback = () => {
    setUpdateEvents((prevState) => ({
      ...prevState,
      allowFeedback: !prevState.allowFeedback,
      organizer: getOrganizerID(prevState),
    }));
    setNeedToUpdate(true);
  };

  const onFeedbackAdd = (timeStamp, feedbackText) => {
    setUpdateEvents((prevState) => ({
      ...prevState,
      feedbacks: { ...prevState.feedbacks, [timeStamp]: feedbackText },
      organizer: getOrganizerID(prevState),
    }));
    setNeedToUpdate(true);
  };

  const fetchUpdateEvent = async (event) => {
    await api.updateEventById(event.id, event);
    const events = await api.getAllEvents();
    const formattedEvents = sortByDateTime(events);
    onFetch(formattedEvents);
  };

  const deleteFeedback = (feedback, timeStamp) => {
    delete feedback[timeStamp];
    setAllFeedbacks({ ...feedback });
    return { ...feedback };
  };

  const getDeletedFeedback = (timeStamp) => {
    setUpdateEvents((prevState) => ({
      ...prevState,
      feedbacks: deleteFeedback(prevState.feedbacks, timeStamp),
      organizer: getOrganizerID(prevState),
    }));
    setNeedToUpdate(true);
  };

  // todo: think about refactor

  useEffect(() => {
    const css = `.ant-modal-header { background-color: ${getEventColor(eventColors, type)}5e; }`;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.querySelector('.modal-info').appendChild(style);
  }, []);
  const makeFeedback = allowFeedback && !isMentor && (
    <Tooltip placement="left" title={STUDENT_ADD_FEEDBACK_TEXT}>
      <Button icon={<FormOutlined />} style={feedbackButtonStyles()} onClick={onFeedbackBtnClick} />
    </Tooltip>
  );
  const titleWidth = isMentor ? 250 : null;
  const feedBackButton = isMentor && (
    <Tooltip title={MENTOR_SHOW_FEEDBACKS_TEXT}>
      <Button icon={<ReadOutlined />} style={feedbackButtonStyles()} onClick={onFeedbackBtnClick} />
    </Tooltip>
  );

  const feedBackSwitch = isMentor && (
    <Switch
      className="c"
      checkedChildren="ON Feedback "
      unCheckedChildren="OFF Feedback "
      defaultChecked={allowFeedback}
      style={feedbackSwitchStyles()}
      onChange={toggleAllowFeedback}
    />
  );

  return (
    <div className="modal-info">
      <Modal
        width={650}
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
        visible={displayModal}
        title={
          <div className="modal__title__container">
            <div style={{ width: titleWidth }}>
              <Line title={taskName} text={getTopic()} styles={{ fontSize: titleTextSize }} />
            </div>
            {feedBackSwitch}
          </div>
        }
        footer={null}
        onCancel={() => {
          if (isNeedToUpdate && isMentor) {
            fetchUpdateEvent(updatedEvent);
            setNeedToUpdate(false);
          }
          if (isNeedToUpdate) {
            fetchUpdateEvent(updatedEvent);
            setNeedToUpdate(false);
          }
          setDisplayModal(false);
        }}
      >
        <FeedbackContainer
          {...{
            displayFeedbackModal,
            setDisplayFeedback,
            onFeedbackAdd,
            isMentor,
            allFeedbacks,
            currentTimezone,
            getDeletedFeedback,
          }}
        />
        <Space direction="vertical">
          <Line title={estimatedWeek} text={week} styles={{ fontSize }} />
          <Line title={taskType} text={getTypeTaskTags()} styles={{ fontSize }} />
          <Line title={taskStart} text={startDate} type="success" styles={{ fontSize }} />
          <Line title={taskDeadline} text={deadlineDate} type="danger" styles={{ fontSize }} />
          <Line title={estimatedStudyTime} text={estimatedTime} styles={{ fontSize }} />
          <Line title={taskPlace} text={place} styles={{ fontSize }} />
          <Line
            title={taskDescription}
            text={description}
            styles={{ fontSize, display: 'flex', textAlign: 'justify' }}
          />
          <Line title={taskLinks} text={getLinks()} styles={{ fontSize }} />
          <Line title={taskOrganizer} text={getOrganizer()} styles={{ fontSize }} />
          <Line
            title={taskComment}
            text={comment}
            styles={{ fontSize, display: 'flex', textAlign: 'justify' }}
          />
          {feedBackButton}
          {makeFeedback}
        </Space>
        {isOfflineEvent && <MapContainer place={place} />}
      </Modal>
    </div>
  );
};

const Line = ({ title, text, type, styles }) => {
  const { Text } = Typography;
  const mode = type && text !== noInfo;
  return (
    <>
      <Text strong style={styles}>
        {title}
      </Text>
      <Text type={mode && type} strong={mode} style={styles}>
        {text}
      </Text>
    </>
  );
};
const mapStateToProps = ({
  eventColors,
  currentTimezone,
  fontSize,
  titleTextSize,
  role,
  feedbackMode,
  onFetch,
}) => ({
  eventColors,
  currentTimezone,
  fontSize,
  titleTextSize,
  role,
  feedbackMode,
  onFetch,
});
export default connect(mapStateToProps, {
  onFetch: onSetEvents,
})(ModalInfo);
