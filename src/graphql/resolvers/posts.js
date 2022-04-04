export const posts = async (parent, args, context) => {
  return {
    posts: [
      {
        id: 1,
        title: "Hello World",
      },
      {
        id: 2,
        title: "Hello World 2",
      },
    ],
  };
};
