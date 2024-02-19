"use client"
import React, {useState} from 'react'
import styles from './style/page.module.css'
import c2cstyle from "./style/click2call.css";
import handleClickToCall from "./services/app.click2call"
import activatePhoneNumber from "./services/activateNumber"
 
const Home = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
  
    const handleCLick = async () =>{
      console.log('phoneNumber', phoneNumber, 'name', name)
      const isPhoneNumberActive = await activatePhoneNumber(phoneNumber) 
      console.log('isPhoneNumberActive', isPhoneNumberActive)
      if(isPhoneNumberActive || !phoneNumber){
        handleClickToCall(phoneNumber, name, c2cstyle)
      }
    }
  
    return <main className={styles.main}>
        <div className={styles.center}>
          <h1>Click2Call POC</h1>
          <input name="phone" 
                 placeholder="Enter Caller Name" 
                 type="text" 
                 onChange={e => setName(e.target.value)} 
                 value={name}
                 className={styles.input}
          />
          <input name="phone" 
                 placeholder="Enter Phone Number" 
                 type="tel" 
                 onChange={e => setPhoneNumber(e.target.value)} 
                 value={phoneNumber}
                 className={styles.input}
          />
          <button onClick={handleCLick} className={styles.button}>ClickToCall</button>
        </div>
      </main>
  }
  
  export default Home