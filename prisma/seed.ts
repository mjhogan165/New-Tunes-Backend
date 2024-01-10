import { prisma } from "./prisma-instance";
import { clearDb } from "./clearDb";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { FriendRequest } from "@prisma/client";

export async function seedUsers() {
  await clearDb();
  const userOne = await prisma.user.create({
    data: {
      username: "user-one",
      password: "passwordsyeah",
      email: "bestemail@email.com",
    },
  });
  // const userTwo = await prisma.user.create({
  //   data: {
  //     username: "user-two",
  //     password: "bigface",
  //     email: "yellowmanl@email.com",
  //   },
  // });
  // const userThree = await prisma.user.create({
  //   data: {
  //     username: "user-one",
  //     password: "wateriscool",
  //     email: "awsomel@email.com",
  //   },
  // });
  // const userFour = await prisma.user.create({
  //   data: {
  //     username: "user4",
  //     password: "pw4",
  //   },
  // });
  // const friendRequest = await prisma.friendRequest.create({
  //   data: {
  //     sender: "user-one",
  //     receiver: "user-two",
  //     status: "accepted",
  //   },
  // });
  // const NewTune = await prisma.newTune.create({
  //   data: {
  //     artist: "Ignacio Jazz",
  //     title: "Bohemian Rhapsody",
  //     img: "https://loremflickr.com/100/100/abstract?lock=48884",
  //     createdBy: "user0",
  //     comment:
  //       "Soluta voluptas architecto delectus neque maxime.\nSit iusto tenetur nostrum unde enim esse.",
  //     tagged: "user2",
  //     id: 2,
  //   },
  // });
  // const NewTune2 = await prisma.newTune.create({
  //   data: {
  //     artist: "Jacynthe Jazz Jazz",
  //     title: "Bohemian Rhapsody",
  //     img: "https://loremflickr.com/100/100/abstract?lock=48884",
  //     createdBy: "user0",
  //     comment:
  //       "Soluta voluptas architecto delectus neque maxime.\nSit iusto tenetur nostrum unde enim esse.",
  //     tagged: "user2",
  //     id: 2,
  //   },
  // });

  const accounts = generateAccounts(15);
  function generateAccounts(maxAccounts: number) {
    const inputArray: User[] = [];
    for (let i = 0; i < maxAccounts; i++) {
      const profileImg = faker.image.avatar();
      console.log(profileImg);
      inputArray.push({
        username: `user${i}`,
        profileImg: profileImg,
        password: `pw${i}`,
        email: faker.internet.email(),
        id: i,
      });
    }
    return inputArray;
  }
  const returnDefaultTune = (user: string, id: number) => {
    const createdBy = id === 0 ? "user1" : "user0";
    const tagged = id === 0 ? "user0" : user;

    return {
      artist: `${faker.person.firstName()} ${faker.music.genre()}`,
      title: faker.music.songName(),
      img: faker.image.urlLoremFlickr(),
      createdBy: createdBy,
      comment: faker.lorem.lines(2),
      tagged: tagged,
      id: id,
    };
  };

  function generateTunes() {
    const inputArray = [];
    for (let index = 0; index < accounts.length; index++) {
      const account = accounts[index];
      inputArray.push(returnDefaultTune(account.username, index));
    }
    for (let index = accounts.length; index < accounts.length + 75; index++) {
      const num1 = generateRandomInt(accounts.length);
      let num2 = generateRandomInt(accounts.length);
      if (num1 === num2) {
        num2 = num1 + 1;
      }
      const createdBy = "user" + num1.toString();
      const tagged = "user" + num2.toString();

      const randomTune = {
        artist: `${faker.person.firstName()} ${faker.music.genre()}`,
        title: faker.music.songName(),
        img: faker.image.urlLoremFlickr(),
        createdBy: createdBy,
        comment: faker.lorem.lines(2),
        tagged: tagged,
        id: index,
      };

      inputArray.push(randomTune);
    }

    return inputArray;
  }

  function generateRandomInt(limit: number) {
    return Math.floor(Math.random() * (limit - 0) + 0);
  }

  const generateAllUniquePairs = (array: User[], start: number) => {
    const allCombos = [];
    for (let i = start; i <= array.length; i++) {
      const current = "user" + i;
      const iPlusOne = i + 1;
      for (let n = iPlusOne; n <= array.length; n++) {
        const otherUser = "user" + n;
        allCombos.push([current, otherUser]);
      }
    }
    return allCombos;
  };
  let allPossiblePairs = generateAllUniquePairs(accounts, 0);

  function generateFriendRequests(numberPerUser: number) {
    const requestArray: FriendRequest[] = [];
    let idCount = 0;
    for (let index = 0; index < accounts.length; index++) {
      const currentUser = accounts[index].username;
      const hasUser = allPossiblePairs.filter((pair) => {
        const values = Object.values(pair);
        return values.includes(currentUser);
      });
      for (let subIndex = 0; subIndex < numberPerUser; subIndex++) {
        const randomInt = generateRandomInt(hasUser.length);
        const randomPair = hasUser[randomInt];
        hasUser.splice(randomInt, 1);
        const reciever =
          randomPair[0] === currentUser ? randomPair[1] : randomPair[0];
        requestArray.push({
          status: "accepted",
          sender: currentUser,
          receiver: reciever,
          id: idCount,
        });
        idCount++;
        allPossiblePairs = allPossiblePairs.filter((pair) => {
          if (pair.includes(randomPair[0])) {
            if (pair.includes(randomPair[1])) {
              return false;
            }
          }
          return true;
        });
      }
    }

    for (let index = 0; index < allPossiblePairs.length; index++) {
      const users = allPossiblePairs[index];
      if (index % 2 === 0) {
        requestArray.push({
          status: "pending",
          sender: users[0],
          receiver: users[1],
          id: idCount,
        });
        idCount++;
      } else {
        requestArray.push({
          status: "rejected",
          sender: users[0],
          receiver: users[1],
          id: idCount,
        });
        idCount++;
      }
    }
    return requestArray;
  }
  const totalRequests = generateFriendRequests(3);
  const data = {
    users: accounts,
    tunes: generateTunes(),
    friendRequests: totalRequests,
  };

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    await prisma.user.create({
      data: {
        username: account.username,
        password: account.password,
        email: account.email,
        profileImg: account.profileImg,
      },
    });
  }
  for (let i = 0; i < totalRequests.length; i++) {
    const request = totalRequests[i];
    await prisma.friendRequest.create({
      data: {
        sender: request.sender,
        receiver: request.receiver,
        status: request.status,
      },
    });
  }
  for (let i = 0; i < data.tunes.length; i++) {
    const tune = data.tunes[i];
    await prisma.newTune.create({
      data: {
        img: tune.img,
        artist: tune.artist,
        title: tune.title,
        createdBy: tune.createdBy,
        tagged: tune.tagged,
        comment: tune.comment,
      },
    });
  }
  return {
    tunes: { data: data.tunes },
    // friendRequests: {
    //   friendRequest,
    // },
    // users: {
    //   userOne,
    //   userTwo,
    //   userThree,
    // },
  };
}
