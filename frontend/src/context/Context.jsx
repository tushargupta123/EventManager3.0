import React,{useEffect,useState,createContext} from "react";
import { contractABI,contractAddress } from "../utils/constants";
export const Context = createContext();
const {ethereum} = window;
const ethers = require("ethers")    

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress,contractABI,signer);
    return contract;
}

export const Provider = ({children}) =>{
    const [currentAccount,setCurrentAccount] = useState('');

    const connectWallet = async() => {
        try{
            if(!ethereum){
                return alert("please install metamask");
            }else{
                const account = await ethereum.request({method:'eth_requestAccounts'});
                setCurrentAccount(account[0]);
            }
        }catch(e){
            throw new Error("no ethereum object");
        }
    }

    const checkIfWalletIsConnected = async() => {
        try{
            if(!ethereum){
                return alert("please install metamask");
            }else{
                const account = await ethereum.request({method:'eth_accounts'});
                if(account.length){
                    setCurrentAccount(account[0]);
                }else{
                    console.log("no account found")
                }
            }
        }catch(e){
            throw new Error("no ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    },[]);

    return(
        <Context.Provider value={{connectWallet,currentAccount,getEthereumContract}}>
            {children}
        </Context.Provider>
    )
}