import { useCalculateBirthday } from '~~/composables/birthday';
import { useTerworkingMember } from '~~/composables/terworking';

export default () => {
  const members = useTerworkingMember();
  const { calculateSecondsBeforeBirthday } = useCalculateBirthday();

  const membersBirthdayInSeconds = members.map((member) =>
    calculateSecondsBeforeBirthday(member)
  );

  let farthestBirthday = -Infinity;
  membersBirthdayInSeconds.forEach((value) => {
    if (farthestBirthday < value) farthestBirthday = value;
  });

  const farthestBirthdayIndex =
    membersBirthdayInSeconds.indexOf(farthestBirthday);

  return members[farthestBirthdayIndex];
};
