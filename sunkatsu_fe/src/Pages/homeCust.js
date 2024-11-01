import CategoryButton from "../components/Elements/Button/CategoryButton"
import Footer from "../components/Fragment/footer"
import Hero from "../components/Fragment/hero"
import Hero2 from "../components/Fragment/hero2"
import Card from "../components/Fragment/menuCard"
import MenuDetail from "../components/Fragment/menuDetail"
import Navbar from "../components/Fragment/Navbar"


const HomeCustomer = () => {
    return (
        <>
        <div>
            <Navbar />
            <h1 style= {{ color: 'red', fontSize: '42px', fontWeight: 'bold', textAlign: 'center'}}>OUR BEST SELLER</h1>
            <Hero />
            <h1 style= {{ color: 'red', fontSize: '42px', fontWeight: 'bold', textAlign: 'center'}}>ORDER AGAIN</h1>
            <main className="content">
                <div style={{display: 'flex', justifyContent:'center', gap: '10px'}} >
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            <h1 style= {{ color: 'red', fontSize: '42px', fontWeight: 'bold', textAlign: 'center'}}>ORDER MENU</h1>
            <CategoryButton />
            <div style={{display: 'flex', justifyContent:'center', gap: '10px'}} >
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            <div style={{display: 'flex', justifyContent:'center', gap: '10px'}} >
                    <Card />
                    <Card />
                    <Card />
                    <Card />
            </div>

            </main>
            <Footer />
        </div>
        </>
    )
}

export default HomeCustomer