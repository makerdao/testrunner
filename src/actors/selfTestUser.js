const keys = {
  user1: '0xa',
  user2: '0xb'
};

export default function(name) {
  return {
    privateKey: keys[name],
    name: name
  };
}
