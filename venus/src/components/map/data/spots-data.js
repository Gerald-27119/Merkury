export const SpotsData = [
  {
    id: 1,
    name: "Pomnik konny Jana III Sobieskiego",
    description:
      "Brązowy posąg XVII-wiecznego polskiego króla Jana III Sobieskiego na koniu usytuowany na małym placu.",
    rating: 4,
    comments: [
      {
        id: 1,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam accumsan pharetra eros, a convallis lacus porttitor vel. Ut sit amet est posuere, tincidunt mi sit amet, lobortis libero. Nunc posuere lorem urna, eget pulvinar orci fringilla sed. Quisque ut lacus ac sem fermentum ultricies et bibendum mauris. Nam at dolor. ",
        rating: 5,
        publishDate: "12-06-2024",
        author: "user2",
      },
      {
        id: 2,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus, turpis quis porttitor pellentesque, justo erat interdum justo, sit amet rutrum urna nulla quis mi. Nunc interdum dolor a lorem ullamcorper, vel eleifend elit congue. ",
        rating: 3.5,
        publishDate: "14-06-2024",
        author: "user1",
      },
      {
        id: 3,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus, turpis quis porttitor pellentesque, justo erat interdum justo, sit amet rutrum urna nulla quis mi. Nunc interdum dolor a lorem ullamcorper, vel eleifend elit congue. ",
        rating: 3.5,
        publishDate: "10-06-2024",
        author: "user31",
      },
    ],
    photos: [
      {
        id: 1,
        author: "user2",
        title: "title1",
        img: "https://www.adorama.com/alc/wp-content/uploads/2018/11/landscape-photography-tips-yosemite-valley-feature-825x465.jpg",
      },
      {
        id: 2,
        author: "user2",
        title: "title2",
        img: "https://www.printique.com/wp-content/uploads/2016/10/photography-landscape-adoramapix.jpg",
      },
      {
        id: 3,
        author: "user1",
        title: "title",
        img: "https://iso.500px.com/wp-content/uploads/2014/07/big-one.jpg",
      },
      {
        id: 4,
        author: "user1",
        title: "title",
        img: "https://cdn.pixabay.com/photo/2023/12/15/22/37/mountains-8451480_640.jpg",
      },
    ],
    weather: {
      general: "sunny",
      sunrise: "06:54",
      sunset: "20:32",
      temperature: 20,
      humidity: 50,
      winds: [
        {
          height: 0,
          speed: 20,
        },
        {
          height: 20,
          speed: 30,
        },
        {
          height: 40,
          speed: 50,
        },
        {
          height: 70,
          speed: 90,
        },
        {
          height: 200,
          speed: 120,
        },
      ],
    },
    contourCoordinates: [
      [54.352223, 18.647865],
      [54.352293, 18.648729],
      [54.35217, 18.64886],
      [54.351863, 18.648476],
      [54.352127, 18.647795],
      [54.352223, 18.647865],
    ],
  },
  {
    id: 2,
    name: "Skwer Czesława Niemena",
    description: "Mały park z ławkami i pomnikiem Czesława Niemena.",
    rating: 3,
    comments: [
      {
        id: 1,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae tortor et metus condimentum dapibus. Pellentesque ac ligula ut massa. ",
        rating: 4.5,
        publishDate: "12-07-2024",
        author: "user1",
      },
      {
        id: 2,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pulvinar congue tellus at eleifend. Cras lorem enim, egestas vel ex a, euismod varius metus. Quisque imperdiet iaculis tempus. Nunc eget maximus odio. Donec dignissim ligula vitae nulla molestie, vitae interdum. ",
        rating: 2,
        publishDate: "12-06-2023",
        author: "user4",
      },
    ],
    photos: [],
    weather: {
      general: "sunny",
      sunrise: "06:54",
      sunset: "20:32",
      temperature: 20,
      humidity: 50,
      winds: [
        {
          height: 0,
          speed: 20.4,
        },
        {
          height: 20,
          speed: 30.67,
        },
        {
          height: 70,
          speed: 90,
        },
        {
          height: 200,
          speed: 120.1,
        },
      ],
    },
    contourCoordinates: [
      [54.352541, 18.643992],
      [54.35239, 18.64477],
      [54.352299, 18.644891],
      [54.352197, 18.645478],
      [54.35207, 18.645385],
      [54.352022, 18.643854],
      [54.35215, 18.643724],
      [54.352541, 18.643992],
    ],
  },
];
