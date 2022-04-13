const birthdayIsThisYear = (target: Member) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return target.month > month || (target.month === month && target.day > day);
};

export const useCalculateBirthday = () => {
  return {
    calculateBirthdayAge: (target: Member) => {
      const today = new Date();
      const birthdayYear = birthdayIsThisYear(target)
        ? today.getFullYear()
        : today.getFullYear() + 1;

      return birthdayYear - target.year;
    },

    calculateSecondsBeforeBirthday: (target: Member) => {
      const today = new Date();
      const birthdayYear = birthdayIsThisYear(target)
        ? today.getFullYear()
        : today.getFullYear() + 1;
      const birthdayDate = new Date(birthdayYear, target.month - 1, target.day);

      return Math.floor(
        (birthdayDate.valueOf() - today.valueOf()) / 1000
        // divide by 1000 because it actually is returning miliseconds
      );
    },
  };
};
