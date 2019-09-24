const keys = {
  user1: '0xa',
  user2: '0xb',
  user3: '0xc',
  user4: '0xd',
  user5: '0xe',
  user6: '0xf',
  user7: '0xg',
  user8: '0xh',
  user9: '0xi',
  user10: '0xj'
};

export default function(name) {
  return {
    privateKey: keys[name],
    name: name
  };
}
