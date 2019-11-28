const keys = {
  user1: '2b8fb8c5fbaaf4f74e140403d3988616811b3340c6d323f77e1033fc4b6896a7',
  user2: '5b5ae7e5c29efadf70bc994af46e00f33743736093bdaa4a206cc55491f1d8e2',
  user3: '87bc9e455cb457e65b1029a4a5d95cfa0cf6bd309aca002397738b9c20341495',
  user4: '7a57ab2210b809069adbd9d06eba3cc3d454881b9c6f3f8e04d58d2111b149fd',
  user5: '999f11367306288c275a4db1f887e761004fc3ce781f7a04b08b8aaed51732bf',
  user6: 'fd11dac4f2cd8d3bd0b50db803d8b54d8c5a31aafb0eacba47e4afb06aa9371b',
  user7: 'f4310e8732fb526f00fefbaa3ba95e9576510f6b532a2bb351a292e4cf5fcba2',
  user8: '208e53ef1638f292e07b535871170574fe617f1cafff59968346f656dd13d4d4',
  user9: '85a9a8270a3e303290cb93f0b6e4b941960e17c80dd5070d1c6a6fc473c823ce',
  user10: '2efd7c2bfe12e54d52cb3c0962719683008ae8b1b7717d0ddfb359f5c853d4e2'
};

const addresses = {
  user1: '0x9fFFA552b948ED405C620432E4BEff8F0130224e',
  user2: '0x342103D9edf4746C14dd441d698479a4581802D0',
  user3: '0x015853D08Be6C2526831B35b75D34b75c26ACbC5',
  user4: '0x5dBC4EFF8C36DE92dee66b616fa23980B3F1b8D5',
  user5: '0xc584347Aa05866BCEdf7E04884A3f5A9CC1Faf72',
  user6: '0x315A7A9e1a3FCe9994db20DB3bae51C1fbb0D173',
  user7: '0xd7C6d70c2aFaF07E9552d4cb06EC9359D8C5857B',
  user8: '0xadAce4734D37E54657DDE5809BcC97Cd7b664Eb9',
  user9: '0x44fdcf012d6879a1295B4c7C03Ba5ef08B575C61',
  user10: '0xb50655C305D0Fc28DE09eF8b93Ac5DD367765033'
};

export default async function(name, maker) {
  try {
    await maker.addAccount(name, { type: 'privateKey', key: keys[name] });
  } catch (e) {
    if (e.message !== 'An account with this name already exists.') throw e;
  }
  return { address: addresses[name] };
}
