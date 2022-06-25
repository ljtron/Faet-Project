import logo from './logo.svg';
import './App.css';
// import { WagmiConfig, createClient, useAccount, useConnect, useEnsName } from 'wagmi'
// import { InjectedConnector } from 'wagmi/connectors/injected'
import { ethers } from 'ethers';
import { useState } from 'react';
import linkedinLogo from "./LI-In-Bug-32x27.png";
import githubLogo from "./GitHub-Mark-32px.png"

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

async function getBalance(){
  const address = await signer.getAddress();
  const rawData = await provider.getBalance(address)
  console.log(parseFloat(ethers.utils.formatEther(rawData)))
}



function App() {
  const [transactions, setTransactions] = useState();
  const [loading, setLoading] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [errors, setErrors] = useState(false)

  async function getTransactions(){
    setErrors(false)
    setLoading(true)
    setTransactions()

    console.log("getting transactions")
    const myAddr = await signer.getAddress();
    var currentBlock = await provider.getBlockNumber();
    var startingBlock = currentBlock - 1000
    //https://api.etherscan.io/api?module=account&action=txlist&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken
    
    fetch("https://api.etherscan.io/api?module=account&action=txlist&address="+ addressText +"&startblock=" + startingBlock + "&endblock="+ currentBlock +"&sort=asc&apikey=YourApiKeyToken")
      .then(res => res.json())
      .then(
        (result) => {
          //setIsLoaded(true);
          //setItems(result);
          setTransactions(result)
          setLoading(false)
          //console.log(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          //setIsLoaded(true);
          setErrors(true);
          console.log(error)
        }
    )
    
    //const rawData = await provider.getBalance(address)
    //const transactions = await provider.getHistory(address);
    // var currentBlock = await provider.getBlockNumber();
    // var n = await provider.getTransactionCount(myAddr, currentBlock);
    // var bal = await provider.getBalance(myAddr, currentBlock);
    // for (var i=currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
    //     try {
    //         var block = await provider.getBlock(i, true);
    //         if (block && block.transactions) {
    //             block.transactions.forEach(function(e) {
    //                 if (myAddr == e.from) {
    //                     if (e.from != e.to)
    //                         bal = bal.plus(e.value);
    //                     console.log(i, e.from, e.to, e.value.toString(10));
    //                     --n;
    //                 }
    //                 if (myAddr == e.to) {
    //                     if (e.from != e.to)
    //                         bal = bal.minus(e.value);
    //                     console.log(i, e.from, e.to, e.value.toString(10));
    //                 }
    //             });
    //         }
    //     } catch (e) { console.error("Error in block " + i, e); }
    // }
    //console.log(process.env)
  }

  function LoadingSpinner(){
    return(
      <div className="spinner-container">
        <div className="loading-spinner">
        </div>
      </div>
    )
  }

  function ErrorComponent(){
    return(
      <div className='Error-Component'>
        <h1>Too many request were made give the server a minute then try again later</h1>
      </div>
    )
  }

  const divStyle = {
    // width: '88%',
    // height: '800px',
    // backgroundImage: `url(${linkedin})`,
    // backgroundSize: 'cover',
    //backgroundImage: `url(${linkedin}) no-repeat cover center fixed`
  };

  return (
    <div>
      <div className='mainBody'>
        <div className='Title'>
          <h1 className='Title-head'>F.A.E.T</h1>
          <h3>Fast Access to Ethereum Transactions</h3>
          <p>Disclaimer checks the past 1000 blocks also using a free api</p>
        </div>

        <div className='Input-address-field'>
          <input type="text" className="Input-field" value={addressText} onChange={e => setAddressText(e.target.value)} placeholder="Address of wallet"/>
          <div className='Div-padding'></div>
          <button onClick={getTransactions} className="Button-field">get Transactions</button>
        </div>
      </div>


      {
        transactions?
        //console.log(transactions)
        <div className='Table-Div'>
          <table className='Table-table' cellspacing='15'>
            <tbody className='Table-tbody'>
              <tr>
                <th>Index</th>
                <th>Timestamp</th>
                <th>Transaction Hash</th>
                <th>Gas Price (Gwei)</th>
                <th>Value (Ethereum)</th>
              </tr>
              {
                  transactions.result.length > 0?
                  transactions.result.map(function(item, i){
                    item.index = i
                    //console.log(item);
                    var url = "https://etherscan.io/tx/" + item.hash
                    return(
                    <tr key={i} className="Table-row">
                      <td>{i + 1}</td>
                      <td>{item.timeStamp}</td>
                      <td><a href={url} target="_blank">{item.hash}</a></td>
                      <td>{item.gasPrice}</td>
                      <td>{ethers.utils.formatEther(item.value)}</td>
                    </tr>
                    )
                  }):
                  <h1>There are no transactions in the past 1000 blocks</h1>
              }
            </tbody>
          </table>
        </div>
        :
        loading?
        <LoadingSpinner />:
        errors?
        <ErrorComponent />
        :
        <div className='transactions-div-padding'></div>
      }

      <div className='footer-Div'>
        <div className='Social-footer-div'>
          <div><a href='https://www.linkedin.com/in/lincolnmcloudjr/' target='_blank'><img src={linkedinLogo}/></a></div>
          <div><a href='https://github.com/ljtron/Faet-Project' target='_blank'><img className='githubLogo-social-footer' src={githubLogo}/></a></div>
          <div className='my-personal-website'></div>
        </div>

        <div className='extraInfo-footer-div'>
          <p>This project was inspired by <a href='https://gekt.vercel.app/' target="_blank">G.E.K.T</a></p>
        </div>
      </div>

    </div>

    
    
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
