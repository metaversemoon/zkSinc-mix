import React, { useEffect, useState } from 'react'
import ConstructorArguments from './ConstructorArgs'
import { deploy, deployViaEthers } from '../functionality/deployContract'
import { useAccount, useProvider, useSigner, useTransaction } from 'wagmi'
import { analyzeABI, functionType } from '@/functionality/analyzeABI'
import { storeContract } from '@/functionality/storeData'
import { Contract, ContractFactory, Wallet, ethers } from 'ethers'
import { Registery_ABI, Registery_address } from '@/constants/constants'
import { explorerLink } from '@/constants/constants'
import { useToast } from '@chakra-ui/react'

const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY
const Code = ({ wallet, provider, signer }) => {
  console.log('IN CODE ', provider)
  // console.log('IN CODE ', wallet, provider, signer)
  // const { address } = useAccount()
  // const provider = useProvider()
  // const { data: signer }: any = useSigner()
  const toast = useToast()
  const [contractName, setContractName] = useState('')
  const [sourceCode, setSourceCode] = useState()
  const [output, setOutput] = useState('')
  const [constructorArg, setConstructorArg] = useState('')
  const [argInputs, setArgInputs] = useState([])
  const [ethValue, setEthValue] = useState()

  const [contractAddress, setContractAddress] = useState()
  const [error, setError] = useState()
  const [txLink, setTxLink] = useState('')
  const [compiled, setCompiled] = useState(false)
  const [ipfsLink, setIpfsLink] = useState()

  /// add the ENV thing and enable
  const manager_wallet = new Wallet(private_key, provider)
  const registery_contract = new Contract(
    Registery_address,
    Registery_ABI,
    manager_wallet,
  )
  console.log(
    '🚀 ~ file: SolidityCode.tsx:43 ~ Code ~ registery_contract:',
    registery_contract,
  )

  /// contract with imports have to be managed , not yet handled
  async function handleCompile() {
    if (!sourceCode) {
      toast({
        title: 'No source code',
        description:
          'You need to provide source code to perform compilation!!!',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
      // console.log("no Source code set");
      return
    }

    /// For proper handling we can change the API call format
    const response = await fetch('./api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourceCode }),
    })

    console.log(response)
    const formattedResponse = (await response.json()).output
    // console.log(formattedResponse, "formatted response");

    if (response.status == 200) {
      setOutput(formattedResponse)
      toast({
        title: 'Compilation successfull',
        description:
          'Your code was compiled succesfully, You can deploy your contract now.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      // console.log("Successfully Compiled");
      setError('Successfully Compiled')
      /// analyze the ABI and show const
      handleABI(formattedResponse.abi)

      setCompiled(true)
    } else {
      setError(formattedResponse)
      toast({
        title: 'Compilation error',
        description: `${formattedResponse}`,
        status: 'error',
        duration: 2700,
        isClosable: true,
      })
    }
  }

  async function handleABI(abi) {
    /// analyze the ABI and show constructors
    const data = await analyzeABI(abi)
    console.log(data?.constructor)
    setConstructorArg(data?.constructor)
  }

  async function handleDeploy() {
    /// checking if the contract is compiled
    if (!output?.bytecode) {
      toast({
        title: 'Contract Not Compiled!!!',
        description:
          'Make sure the contract is compiled before proceeding with this process',
        status: 'error',
        duration: 2700,
        isClosable: true,
      })
      // console.log("Compile the Contract first");
      setError('Compile the Contract first')
      return
    }

    /// checking if the contructor has arg
    if (constructorArg[0]?.inputs?.length) {
      console.log('argInputs', argInputs)
      if (!argInputs) {
        toast({
          title: 'No Arguments provided',
          description: `Fill in the constructor arguments in order to deploy this contract`,
          status: 'error',
          duration: 2500,
          isClosable: true,
        })
        // console.log("Add the Constructor Arguements")
        setError('Add the Constructor Arguements')
        return
      }
    }

    console.log('deploying...')
    // toast here
    toast({
      title: 'Deploying Contract....',
      description: `Your contract is being deployed`,
      status: 'loading',
      duration: 2500,
      isClosable: true,
    })

    // console.log(' output:', output)
    // console.log(' signer:', signer)
    const factory = new ContractFactory(output.abi, output.bytecode, signer)
    console.log('MYfactory:', factory)

    let contract
    //handle args
    console.log({ argInputs })
    if (argInputs.length) {
      contract = await factory.deploy(argInputs, {
        value: ethValue ? ethers.utils.parseEther(ethValue) : 0,
      })
    } else {
      console.log('MYELSE')
      contract = await factory.deploy({
        value: 0,
      })
      console.log(
        '🚀 AFTER_____ file: SolidityCode.tsx:171 ~ handleDeploy ~ contract:',
        contract,
      )
    }

    console.log('contract', contract)
    const deployedContractAddress = contract.address
    console.log('deployedContractAddress:', deployedContractAddress)
    setContractAddress(deployedContractAddress)
    const deployTx = contract.deployTransaction

    const contractLink = `${explorerLink}/contract/${deployedContractAddress}`

    toast({
      title: 'Contract Deployed!!!',
      description: `Contract created with the address Copied to clipboard ${deployedContractAddress}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    navigator.clipboard.writeText(deployedContractAddress)
    // console.log(`Contract Created with the address${contractLink}`);

    const txLink = `${explorerLink}/tx/${deployTx.hash}`
    console.log(txLink)
    toast({
      title: 'Transaction Hash',
      description: `${txLink}`,
      status: 'info',
      duration: 5000,
      isClosable: true,
    })
    ///Show the tx
    setTxLink(txLink)
  }

  async function verifyContract() {
    /// store the contract info on the Web3.storage and add the data , CID to a Contract or Web2 Database
    if (!output && !contractAddress) {
      toast({
        title: 'Contract Not Compiled OR Deployed!!!',
        description: `This contract is either not deployed or compiled, which is necessary for contract verification`,
        status: 'error',
        duration: 2800,
        isClosable: true,
      })
      // console.log("Compile & Deploy the Contract first");
      setError('Compile & Deploy the Contract first')
      return
    }

    const contractData = {
      name: contractName,
      address: contractAddress,
      deployer: wallet,
      abi: output?.abi,
      bytecode: output?.bytecode,
      code: sourceCode,
    }
    toast({
      title: 'Uploading to IPFS...',
      status: 'loading',
      duration: 2000,
      isClosable: true,
    })
    const CID = await storeContract(contractData)
    console.log(' CID:', CID)
    const IPFSURL = `https://w3s.link/ipfs/${CID}`
    console.log(IPFSURL, 'IPFSURL')

    setIpfsLink(IPFSURL)
    toast({
      title: 'IPFS URL',
      description: `${IPFSURL}`,
      status: 'success',
      duration: 2800,
      isClosable: true,
    })
    /// Store the IPFS link somewhere
    console.log('contractAddress', contractAddress)
    const tx = await registery_contract.addContractRecord(
      contractAddress,
      IPFSURL,
    )

    // await tx.wait()
    console.log(' tx:', tx)
    toast({
      title: 'Adding Contract to Registry',
      status: 'loading',
      duration: 2500,
      isClosable: true,
    })

    // console.log('Record Added in the registery')
    // toast({
    //   title: 'Record Added in the Registry',
    //   status: 'success',
    //   duration: 3000,
    //   isClosable: true,
    // })
  }

  return (
    <div className="flex items-center justify-center flex-col">
      {/* Add the ContractName input box */}

      <h1 className="text-white font-bold text-2xl text-skin-base my-4 leading-tight lg:text-5xl tracking-tighter mb-6 lg:tracking-normal">
        Submit Your Code Here
      </h1>
      <textarea
        onChange={(e) => setSourceCode(e.target.value)}
        className="w-8/12 sm:w-6/12 h-[70vh] mb-10 p-10 bg-gray-900 text-white text-xl rounded-2xl"
      />
      {constructorArg?.length && (
        <ConstructorArguments
          args={constructorArg}
          inputs={argInputs}
          setInputs={setArgInputs}
          eth={ethValue}
          setEth={setEthValue}
        />
      )}
      <div className="flex items-center justify-between flex-col sm:flex-row">
        <button
          onClick={() => handleCompile()}
          className="bg-gradient-to-t from-[#201CFF] to-[#C41CFF] py-2 px-10 hover:bg-gradient-to-b from-[#201CFF] to-[#C41CFF] sm:mr-10 mb-5 text-white"
        >
          Compile
        </button>
        {compiled && (
          <button
            onClick={() => handleDeploy()}
            className="bg-gradient-to-t from-[#201CFF] to-[#C41CFF] py-2 px-10 hover:bg-gradient-to-b from-[#201CFF] to-[#C41CFF] sm:mr-10 mb-5 text-white"
          >
            Deploy
          </button>
        )}
        {compiled && (
          <button
            onClick={() => verifyContract()}
            className="bg-gradient-to-t from-[#201CFF] to-[#C41CFF] py-2 px-10 hover:bg-gradient-to-b from-[#201CFF] to-[#C41CFF] sm:mr-10 mb-5 text-white"
          >
            Verify
          </button>
        )}
      </div>
    </div>
  )
}

export default Code
