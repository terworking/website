import { useCalculateBirthday } from '~~/composables/birthday';
import { useTerworkingMember } from '~~/composables/terworking';

export default () => {
  const members = useTerworkingMember();
  const { calculateSecondsBeforeBirthday } = useCalculateBirthday();

  const membersBirthdayInSeconds = members.map((member) =>
    calculateSecondsBeforeBirthday(member)
  );

  let closestBirthday = +Infinity;
  membersBirthdayInSeconds.forEach((value) => {
    if (closestBirthday > value) closestBirthday = value;
  });

  const closestBirthdayIndex =
    membersBirthdayInSeconds.indexOf(closestBirthday);

  return members[closestBirthdayIndex];
};
