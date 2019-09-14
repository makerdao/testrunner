const keys = {
  user1: '0xa',
  user2: '0xb',
  user3: '0xc',
  user4: '0xd',
  user5: '0xe'
};

export default function(name) {
  return {
    privateKey: keys[name],
    name: name
  };
}
