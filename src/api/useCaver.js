import Caver from 'caver-js';
//import CounterABI from '../abi/counterABI.json';
import KIP17ABI from '../abi/KIP17tokenABI.json';
import {ACCESS_KEY_ID, SECRET_ACCESS_KEY, COUNT_CONTRACT_ADDRESS,NFT_CONTRACT_ADDRESS,CHAIN_ID  } from '../constants';

const option = {
    headers: [
      {
        name: "Authorization",
        value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
      },
      { name: "x-chain-id", value: CHAIN_ID }
    ]
  }
  
  const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))
  const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS)

  export const fetchCardsOf = async (address) => {
    //fetch balance
    const balance = await NFTContract.methods.balanceOf(address).call();
    console.log(`[NFT Balance] ${balance}`);
    //fetch token ids
    const tokenIds =[];
    for (let i=0;i<balance;i++){
      const id = await NFTContract.methods.tokenOfOwnerByIndex(address,i).call();
      tokenIds.push(id);
    }
    //fetch token uris
    const tokenURIs =[];
    for (let i=0;i<balance;i++){
      const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
      tokenURIs.push(uri);
    }

    const nfts = [];
    for (let i=0;i<balance;i++){
      nfts.push({uri: tokenURIs[i], id: tokenIds[i]});
    }
    //console.log(nfts);
    return nfts;
    // console.log(`[Token IDs] ${tokenIds}`);
    // console.log(`[Token URIs] ${tokenURIs}`);
    // console.log(`[Token URIs] ${tokenURIs[0]}`);
    
  }

 
  
export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(`BALANCE: ${balance}`);
    return balance;
  })
}
  
   //const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);
 
 // export const readCount = async () => {
  //   const _count = await CountContract.methods.count().call();
  //   console.log(_count);
  // }

  // export const setCount = async(newCount) => {
  //   //사용할 어카운트 설정
  //   try {
  //     const prvatekey = '0x82740ff206870f3fe104a6224b34e30ad041029494c7ee4ab01cfd6b37a5e352';
  //     const deployer = caver.wallet.keyring.createFromPrivateKey(prvatekey);
  //     caver.wallet.add(deployer);
  //     //스마트 컨트랙트 실행 트랜잭션 날리기
  //     //결과확인
  //     const receipt = await CountContract.methods.setCount(newCount).send({
  //       from: deployer.address,//address
  //       gas: "0X4bfd300"
  //     })
  //     console.log(receipt);
  //   }
  //   catch (e) {
  //     console.log(`[ERROR_SET_COUNT]${e}`);
  //   }
  // } 
  // // smart contract 배포 주소 파악
  
  // caver.js 활용 smart contract 연동