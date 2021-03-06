import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Badge, Calendar, Tooltip } from 'antd';

import ModalInfo from '../modal-info/modal-info';
import { filterDataByDay, getListData } from '../../utils/calendarHelpers';
import getFormattedDate from '../../utils/getFormattedDate';
import getFontSize from '../../utils/getFontSize';

import EventPopUp from './eventPopUp';
import {
  INACTIVE_EVENT_TYPE,
  INACTIVE_EVENT_COLOR,
  LARGE_MOBILE_WIDTH,
  DESKTOP_WIDTH,
  BADGE_HEIGHT,
} from '../../constants/calendarConstants';
import './calendar.scss';

/**
 * Creates tooltip component
 *
 * @param {string} text test which will be displayed
 * @param {number} fontSize current fontsize
 * @example
 * const text = 'Add feedback';
 * const fontSize = 14;
 *
 * return (
 * <EllipsisText text={text} fontSize={fontSize} />)
 */

const EllipsisText = (text, fontSize) => (
  <Tooltip placement="topLeft" title={text}>
    <div
      style={{
        width: `${window.innerWidth <= DESKTOP_WIDTH ? '30px' : '80px'}`,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize,
      }}
    >
      {text}
    </div>
  </Tooltip>
);

/**
 * Function which draws unordered list for every day in calendar depending on event on this day
 *
 * @param {Object} value current date
 * @param {Object} eventColors events colors object
 * @param {function} onEventClick on event click function
 * @param {string} currentTimezone current Country/City format
 * @param {Object} selectedEvents events which has been selected
 * @param {number} fontSize current fontsize
 *
 */

const dateCellRender = (
  value,
  eventColors,
  onEventClick,
  currentTimezone,
  selectedEvents,
  fontSize,
) => {
  const listData = getListData(value, selectedEvents, eventColors, currentTimezone);

  return (
    <ul
      className="calendar__events"
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {listData.map((item) => {
        const { dateTime, name, color, id } = item;
        const activeEvent = Date.now() > new Date(getFormattedDate(dateTime, currentTimezone));
        const textType = activeEvent ? INACTIVE_EVENT_TYPE : null;
        const badgeText =
          window.innerWidth <= LARGE_MOBILE_WIDTH ? '' : EllipsisText(name, fontSize);

        return (
          <li key={id}>
            <Badge
              onClick={() => onEventClick(item)}
              color={color}
              text={badgeText}
              style={{
                color: textType ? INACTIVE_EVENT_COLOR : color,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: BADGE_HEIGHT,
                fontSize,
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Creates calendar component based on selectedEvents, colors, timezone and textSize
 * @component
 * @example
 * const eventColors = {'js task': '#44444'}
 * const currentTimezone = Europe/Minsk
 * const selectedEvents = [{week: 0, name: 'JS basics', description: 'interesting course'....}]
 * const textSize = 16
 *
 * return (
 *    <CalendarContainer {...{eventColors, currentTimezone, selectedEvents, textSize}} />
 * )
 */

const CalendarContainer = ({ eventColors, currentTimezone, selectedEvents, textSize }) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [eventDescription, setEventDescription] = useState(null);
  const [displayPopUp, setDisplayPopUp] = useState(false);
  const [currentDateEvents, setCurrentDateEvents] = useState(null);
  const fontSize = getFontSize(textSize, 1.6);
  const titleTextSize = getFontSize(textSize, 1.9);

  /**
   * Function displays actions on exact event click.
   * It sets event description state
   * sets if to display small modal on mobile devices
   *
   * @param {sting} eventName
   */

  const onEventClick = (eventName) => {
    setEventDescription(eventName);
    if (window.innerWidth <= LARGE_MOBILE_WIDTH) {
      if (displayPopUp) {
        setDisplayModal(true);
      }
    } else {
      setDisplayModal(true);
    }
  };

  return (
    <>
      <Calendar
        className="schedule__calendar"
        dateCellRender={(value) =>
          dateCellRender(
            value,
            eventColors,
            onEventClick,
            currentTimezone,
            selectedEvents,
            fontSize,
            titleTextSize,
          )
        }
        onSelect={(value) => {
          if (window.innerWidth <= LARGE_MOBILE_WIDTH) {
            const dayEvents = filterDataByDay(value, selectedEvents, currentTimezone);
            setCurrentDateEvents(dayEvents);
            setDisplayPopUp(true);
          }
        }}
      />
      {displayModal && (
        <ModalInfo
          {...{
            eventDescription,
            displayModal,
            setDisplayModal,
          }}
        />
      )}
      {displayPopUp && (
        <EventPopUp
          currentDateEvents={currentDateEvents}
          displayPopUp={displayPopUp}
          onEventClick={onEventClick}
          setDisplayPopUp={setDisplayPopUp}
          displayModal={displayModal}
          textSize={titleTextSize}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ eventColors, currentTimezone, selectedEvents, fontSize }) => ({
  eventColors,
  currentTimezone,
  selectedEvents,
  textSize: fontSize,
});

export default connect(mapStateToProps)(CalendarContainer);
