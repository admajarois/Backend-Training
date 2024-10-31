const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: () => {
      return {
        status: 'success',
        data: {
          users: "users",
        },
      };
    },
  },
]);

module.exports = routes;
