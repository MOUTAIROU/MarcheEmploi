"use client"
import "./style.css"
import Link from "next/link";

export default function Header() {


  return (
    <header className="header">
      <div className="left">
        <a href="/"><div className="logo">MarcheEmploi</div></a>
        <nav className="nav">
          <Link href={`${process.env.LOCAL_HOST}/emploi`}>Emplois</Link>
          <Link href={`${process.env.LOCAL_HOST}/recrutement`}>Recrutement</Link>
          <Link href={`${process.env.LOCAL_HOST}/appels-offres`}>Appels d'offres</Link>
          <Link href={`${process.env.LOCAL_HOST}/recherche`}>Recherche</Link>
          <Link href={`${process.env.LOCAL_HOST}/savoir-faire`}>Savoir-faire</Link>
        </nav>
      </div>

      <div className="right">
        <div className="lang">
          <span className="active">fr</span> | <span>en</span>
        </div>
        <Link href={`${process.env.LOCAL_HOST}/connexion`} className="login">Se connecter</Link>
        <Link href={`${process.env.LOCAL_HOST}/inscription`} className="signup">Inscription gratuite</Link>
      </div>
    </header>
  )
}
