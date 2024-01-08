const { formatConversations } = require("../utils/utils");

describe("formatConversations", () => {
  test("should return an empty array if an empty array is passed", () => {
    expect(formatConversations("David Black", [])).toEqual([]);
  });
  test("should return an empty array if empty string is passed", () => {
    const messages = [
      {
        _id: "6597dcc771d6711172416816",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
        body: "Hello David",
        __v: 0,
      },
    ];
    expect(formatConversations("", messages)).toEqual([]);
  });
  test("should return single conversation object for a user in an array when passed a single message", () => {
    const messages = [
      {
        _id: "6597dcc771d6711172416816",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
        body: "Hello David",
        __v: 0,
      },
    ];
    const conversations = [
      {
        with: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
      },
    ];
    expect(formatConversations("David Black", messages)).toEqual(conversations);
  });
  test("should return single conversation object for a user in an array when passed 2 messages with the same person", () => {
    const messages = [
      {
        _id: "6597dcc771d6711172416816",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
        body: "Hello David",
        __v: 0,
      },
      {
        _id: "6597dcc771d6711172416817",
        between: ["David Black", "Sarah Blue"],
        from: "David Black",
        timestamp: "2023-12-31T13:34:00",
        body: "Hello Sarah",
        __v: 0,
      },
    ];
    const conversations = [
      {
        with: "Sarah Blue",
        timestamp: "2023-12-31T13:34:00",
      },
    ];
    expect(formatConversations("David Black", messages)).toEqual(conversations);
  });
  test("should return single conversation object for a user in an array when passed more than 2 messages with the same person", () => {
    const messages = [
      {
        _id: "6597dcc771d6711172416816",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
        body: "Hello David",
        __v: 0,
      },
      {
        _id: "6597dcc771d6711172416817",
        between: ["David Black", "Sarah Blue"],
        from: "David Black",
        timestamp: "2023-12-31T13:34:00",
        body: "Hello Sarah",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330caca",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:36:00",
        body: "How are you David",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330cacb",
        between: ["David Black", "Sarah Blue"],
        from: "David Black",
        timestamp: "2023-12-31T13:40:00",
        body: "I am good Sarah",
        __v: 0,
      },
    ];
    const conversations = [
      {
        with: "Sarah Blue",
        timestamp: "2023-12-31T13:40:00",
      },
    ];
    expect(formatConversations("David Black", messages)).toEqual(conversations);
  });
  test("should return 2 conversation objects for a user in an array when passed a 2 messages with different people", () => {
    const messages = [
      {
        _id: "6597dcc771d6711172416816",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
        body: "Hello David",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330cacc",
        between: ["David Black", "Emily White"],
        from: "Alice Green",
        timestamp: "2023-12-31T13:40:00",
        body: "Hello, is anyone there?",
        __v: 0,
      },
    ];
    const conversations = [
      {
        with: "Emily White",
        timestamp: "2023-12-31T13:40:00",
      },
      {
        with: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
      },
    ];
    expect(formatConversations("David Black", messages)).toEqual(conversations);
  });
  test("should return many conversation objects for a user in an array when passed a many messages with many different people", () => {
    const messages = [
      {
        _id: "6597dca7d3f3915d5330cac8",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:31:00",
        body: "Hello David",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330cac9",
        between: ["David Black", "Sarah Blue"],
        from: "David Black",
        timestamp: "2023-12-31T13:34:00",
        body: "Hello Sarah",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330cacc",
        between: ["David Black", "Emily White"],
        from: "David Black",
        timestamp: "2023-12-31T13:35:00",
        body: "Hello, welcome?",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330caca",
        between: ["David Black", "Sarah Blue"],
        from: "Sarah Blue",
        timestamp: "2023-12-31T13:36:00",
        body: "How are you David",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330cacb",
        between: ["David Black", "Sarah Blue"],
        from: "David Black",
        timestamp: "2023-12-31T13:40:00",
        body: "I am good Sarah",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330cacc",
        between: ["David Black", "Emily White"],
        from: "Emily White",
        timestamp: "2023-12-31T13:41:00",
        body: "Hello, is anyone there?",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330caca",
        between: ["Andrew Green", "David Black"],
        from: "David Black",
        timestamp: "2023-12-31T13:55:00",
        body: "How are you Andrew",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330caca",
        between: ["Andrew Green", "David Black"],
        from: "Andrew Green",
        timestamp: "2023-12-31T13:57:00",
        body: "How are you David",
        __v: 0,
      },
      {
        _id: "6597dca7d3f3915d5330caca",
        between: ["Andrew Green", "David Black"],
        from: "David Black",
        timestamp: "2023-12-31T14:02:00",
        body: "Good thanks",
        __v: 0,
      },
    ];
    const conversations = [
      {
        with: "Andrew Green",
        timestamp: "2023-12-31T14:02:00",
      },
      {
        with: "Emily White",
        timestamp: "2023-12-31T13:41:00",
      },
      {
        with: "Sarah Blue",
        timestamp: "2023-12-31T13:40:00",
      },
    ];
    expect(formatConversations("David Black", messages)).toEqual(conversations);
  });
});

const hello = [
  {
    _id: "6597dca7d3f3915d5330cac8",
    between: ["David Black", "Sarah Blue"],
    from: "Sarah Blue",
    timestamp: "2023-12-31T13:31:00",
    body: "Hello David",
    __v: 0,
  },
  {
    _id: "6597dca7d3f3915d5330cac9",
    between: ["David Black", "Sarah Blue"],
    from: "David Black",
    timestamp: "2023-12-31T13:34:00",
    body: "Hello Sarah",
    __v: 0,
  },
  {
    _id: "6597dca7d3f3915d5330caca",
    between: ["David Black", "Sarah Blue"],
    from: "Sarah Blue",
    timestamp: "2023-12-31T13:36:00",
    body: "How are you David",
    __v: 0,
  },
  {
    _id: "6597dca7d3f3915d5330cacb",
    between: ["David Black", "Sarah Blue"],
    from: "David Black",
    timestamp: "2023-12-31T13:40:00",
    body: "I am good Sarah",
    __v: 0,
  },
  {
    _id: "6597dca7d3f3915d5330cacc",
    between: ["David Black", "Emily White"],
    from: "Alice Green",
    timestamp: "2023-12-31T13:40:00",
    body: "Hello, is anyone there?",
    __v: 0,
  },
];
