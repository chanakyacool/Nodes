const users = [{
  id: 1,
  name: 'chan',
  schoolId: 101
},{
  id: 2,
  name: 'dev',
  schoolId: 999
}];

const grades = [{
  id: 1,
  schoolId: 101,
  grade: 86
},{
  id: 2,
  schoolId: 999,
  grade: 100
},{
  id: 3,
  schoolId: 101,
  grade: 80
}];

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const user = users.find((user) => user.id === id)

    if(user) {
      resolve(user);
    } else {
      reject(`Unable to find User with id ${id}`)
    }
  });
};

const getGrades = (schoolId) => {
  return new Promise((resolve, reject) => {
    resolve(grades.filter((grade) => {
      return grade.schoolId == schoolId;
    }))
  })
}

// chan has a 83% in the class
const getStatus = (userId) => {
  let user;
  return getUser(userId).then((tempUser) => {
    user = tempUser;
    return getGrades(user.schoolId);
  }).then((grades) => {
    let avg = 0;
    if(grades.length > 0) {
      avg = grades.map((grade) => grade.grade).reduce((a,b) => a+b)/grades.length;
    }
    // avg
    // return string
    return `${user.name} has a ${avg} in the class`
    console.log(avg)
  })
}

const getStatusAlt = async (userId) => {
  const user = await getUser(userId);
  const grades = await getGrades(user.schoolId);
  let avg = 0;
  if(grades.length > 0) {
    avg = grades.map((grade) => grade.grade).reduce((a,b) => a+b)/grades.length;
  }
  return `${user.name} has a ${avg} in the class`
}

getStatusAlt(1).then((status) => console.log(status)).catch((e) => console.log(e))


// getStatus(2).then((user) => {
//   console.log(user);
// }).catch((e) => {
//   console.log(e)
// })