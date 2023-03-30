import React, { useContext } from 'react'
import { Context } from '../context/Context'

const Navbar = () => {
    const { connectWallet, currentAccount } = useContext(Context);
    return (
        <div>
            <nav class="navbar bg-dark navbar-expand-lg text-light ms-5 me-5 mt-3 ps-4 pe-4">
                <div class="container-fluid">
                    <div>Navbar</div>
                    <form class="d-flex" role="search">
                        {!currentAccount ?
                            <>
                                <button type='button' className='btn btn-light' onClick={connectWallet}>Connect Wallet</button>
                            </> :
                            <>
                                {currentAccount}
                            </>
                        }
                    </form>
                </div>
            </nav>
        </div>
    )
}

export default Navbar