
import Image from "next/image";

type PersonDetailsProps = {
    name: string;
    bio: string;
    birthDate: string;
    gender: string;
    profession: string;
    birthPlace: string;
    popularity: string;
    knownFor: string;
    image: string;
};

export function PersonDetails({
    name,
    bio,
    birthDate,
    gender,
    profession,
    birthPlace,
    popularity,
    knownFor,
    image,
}: PersonDetailsProps) {
    return (
        <div className="relative  mt-[19px] left-1/2 right-1/2 w-screen -translate-x-1/2 bg-light-dropdown py-[29px] flex justify-center">
            <div className="container-1440 flex">

                <div className="w-[371px] h-[520px] flex items-center self-center">
                    <Image
                        src={image}
                        alt={name}
                        width={371}
                        height={520}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="h-fit ml-[28px] mt-[26px] flex flex-col gap-[25px] text-[20px] font-medium font-inter text-black">
                    <p>Name: <span className="text-person-details-data font-normal">{name}</span></p>
                    <div className="flex gap-[10px] max-w-[850px]">
                        <span className="w-fit">Bio:</span>
                        <span className="text-person-details-data font-normal break-words">
                            {bio}
                        </span>
                    </div>
                    <p>Birth Date: <span className="text-person-details-data font-normal">{birthDate}</span></p>
                    <p>Gender: <span className="text-person-details-data font-normal">{gender}</span></p>
                    <p>Profession: <span className="text-person-details-data font-normal">{profession}</span></p>
                    <p>Birth Place: <span className="text-person-details-data font-normal">{birthPlace}</span></p>
                    <p>Popularity: <span className="text-person-details-data font-normal">{popularity}</span></p>
                    <p>Known For: <span className="text-person-details-data font-normal">{knownFor}</span></p>
                </div>
            </div>
        </div>
    );
}