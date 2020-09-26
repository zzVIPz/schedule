const feedbackButtonStyles = (top, right) => ({
  position: 'absolute',
  top,
  right,
});
const feedbackSwitchStyles = () => ({
  marginRight: 25,
  overflow: 'hidden',
});

const getOrganizerID = (prevState) =>
  prevState.organizer.map((item) => {
    if (typeof item === 'string') {
      return item;
    }
    return item.id;
  });

export { feedbackButtonStyles, getOrganizerID, feedbackSwitchStyles };
