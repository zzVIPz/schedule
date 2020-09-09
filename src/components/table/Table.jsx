/* eslint-disable no-console */
import React from 'react';
import { DatePicker, Table, Tag, Space, Tooltip, Divider } from 'antd';
import dummyData from './dummyData';
import extractDateTime from '../../utils/extractDateTime';
import { colorSelector, getOrganizer, getAvatarSrc } from './helpers';
import './Table.scss';
import 'antd/dist/antd.css';

const MyTable = () => {
  const dateFormat = 'DD.MM.YYYY HH:mm';

  const getTimeStamp = (value) => {
    const timestamp = Math.floor(new Date(value).getTime());
    console.log(timestamp);
  };

  function onChange(value, dateString) {
    console.log('TimeStamp: ', value);
    getTimeStamp(dateString);
    console.log('Date and time: ', dateString);
  }

  function onOk(value) {
    console.log('Selected Time: ', value);
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'date',
      render: (date) => <>{extractDateTime(date)}</>,
      sorter: (a, b) => a.dateTime - b.dateTime,
    },
    {
      title: 'Time',
      dataIndex: 'dateTime',
      key: 'time',
      render: (time) => <>{extractDateTime(time, 'time')}</>,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (time) => <>{extractDateTime(time, 'dateTime')}</>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (tags) => (
        <>
          {tags.map((tag) => {
            const color = colorSelector(tag);
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Place',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Estimated Time',
      dataIndex: 'estimatedTime',
      key: 'estimatedTime',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <>
          <a href={record.url} target="_blanc">
            {name}
          </a>
        </>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          <div
            style={{
              width: 200,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Links',
      dataIndex: 'links',
      key: 'links',
      render: (links) => (
        <>
          {links.map(({ name, url }, idx) => (
            <>
              <a
                href={url}
                target="_blanc"
                style={{
                  marginRight: '8px',
                }}
                key={name}
              >
                {name}
              </a>
              {idx !== links.length - 1 ? (
                <Divider style={{ 'background-color': '#757575' }} type="vertical" />
              ) : null}
            </>
          ))}
        </>
      ),
    },
    {
      title: 'Organizer',
      dataIndex: 'organizer',
      key: 'organizer',
      render: (organizers) => (
        <>
          {organizers.map((id) => {
            const { name, url } = getOrganizer(id);
            return (
              <Space key={name}>
                <img
                  src={getAvatarSrc(url)}
                  style={{
                    height: '24px',
                    width: '24px',
                    borderRadius: '12px',
                  }}
                  alt="avatar"
                />
                <a
                  href={url}
                  target="_blanc"
                  style={{
                    marginRight: '8px',
                  }}
                >
                  {name}
                </a>
              </Space>
            );
          })}
        </>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <Tooltip placement="topLeft" title={comment}>
          <div
            style={{
              width: 200,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {comment}
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={dummyData} columns={columns} rowKey="id" size="small" pagination={false} />
      <DatePicker showTime onChange={onChange} onOk={onOk} format={dateFormat} />
    </>
  );
};

export default MyTable;
