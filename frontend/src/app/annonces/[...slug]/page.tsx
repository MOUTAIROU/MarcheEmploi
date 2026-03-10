import HomeClient from "./HomeClient";

interface Props {
  params: { slug: string[] };
}

/*
Pour le seo n'oublie pas title, meta, JSON-LD Google Jobs, et OpenGraph pour réseaux sociaux

  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute  JSON-LD Google Jobs,
  pour le seo ajoute   JSON-LD Google Jobs,
  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute  JSON-LD Google Jobs,
  pour le seo ajoute   JSON-LD Google Jobs,
  
  
  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute  JSON-LD Google Jobs,
  pour le seo ajoute   JSON-LD Google Jobs,
     

  
  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute JSON-LD Google Jobs,
  pour le seo ajoute  JSON-LD Google Jobs,
  pour le seo ajoute   JSON-LD Google Jobs,
     
            */


export default async function Page({ params }: Props) {
  const { slug } = await params;

  const fullSlug = slug.join("-");
  const id = fullSlug.split("-").slice(-5).join("-");

  return <HomeClient annonce_id={id} />;
}
