import HomeClient from "./HomeClient";

interface Props {
    params: { slug: string[] };
}

export default async function Page({ params }: Props) {

    const { slug } = await params;

    const fullSlug = slug.join("-");

    // récupérer le dernier segment comme ID

    const id = fullSlug.split("-").slice(-1).join("-");

    console.log("fullSlug:", fullSlug);
    console.log("id:", id);

    return <HomeClient annonce_id={id} />;
}
