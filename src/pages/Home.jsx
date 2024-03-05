import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Data from "../service/data.json"
import { Link } from "react-router-dom";
//COMPONENT


//ACTIONS
import * as ACTION from "../redux/article";

function Home() {

    const dispatch = useDispatch()
    const store = useSelector(state => state.article.data)
    console.log(store)
    useEffect(() => {
        dispatch(ACTION.FETCH_DATA(Data))
    }, [])



    return (
        <div className="container">
            <h1 className="title">Choix des personnages</h1>
            <div className="cards">
                {store ? store.map((item, index) => {
                    return (
                        <div key={index}>
                            <Link to={`/fight/${index}`}>
                                <div className="character-card">
                                    <h2 className="character-name">{item.name}</h2>
                                    <img className="character-image" src={item.picture} alt="" />
                                    <div className="stats">
                                        <p><span className="stat-label">Speed:</span> {item.speed}</p>
                                        <p><span className="stat-label">Stamina:</span> {item.stamina}</p>
                                        <p><span className="stat-label">Defense:</span> {item.defense}</p>
                                        <p><span className="stat-label">Strength:</span> {item.strength}</p>
                                        <p className="techniques-label">Techniques:</p>
                                        <ul className="techniques-list">
                                            {item.techniques.map((technique, index) => (
                                                <li key={index}>{technique}</li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                }) : null}
                <button className="logout-btn"><Link to="/">Déconnexion</Link></button>
            </div>
        </div>
    );
            }
export default Home
