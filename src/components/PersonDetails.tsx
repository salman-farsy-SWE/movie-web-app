
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
        <div className="relative mt-[19px] left-1/2 right-1/2 w-screen -translate-x-1/2 bg-light-dropdown dark:bg-dropdown xl:px-5 lg:px-6 md:px-7 sm:px-8 px-9 xl:py-[29px] lg:py-[27px] md:py-[20px] sm:py-[15px] py-[21px] flex justify-center">
            <div className="container-1440 flex sm:flex-row flex-col">

                <div className="relative xl:w-[371px] xl:h-[520px] lg:w-[360px] lg:h-[470px] md:w-[350px] md:h-[400px] sm:w-[400px] sm:h-[360px] w-[230px] h-[300px] flex items-center sm:self-center">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="h-fit xl:ml-[28px] lg:ml-[26px] md:ml-[24px] sm:ml-[20px] xl:mt-[26px] lg:mt-[22px] md:mt-[18px] sm:mt-[14px] mt-[16px] flex flex-col xl:gap-[25px] lg:gap-[23px] md:gap-[19px] sm:gap-[15px] gap-[13px] xl:text-[20px] lg:text-[18px] md:text-[16px] sm:text-[14px] text-[12px] font-medium font-inter text-black dark:text-white/85">
                    <p>Name: <span className="text-light-person-details-data dark:text-person-details-data  font-normal">{name}</span></p>
                    <div className="flex gap-[10px] max-w-[850px]">
                        <span className="w-fit">Bio:</span>
                        <span className="text-light-person-details-data dark:text-person-details-data font-normal break-words">
                            {bio}
                        </span>
                    </div>
                    <p>Birth Date: <span className="text-light-person-details-data dark:text-person-details-data font-normal">{birthDate}</span></p>
                    <p>Gender: <span className="text-light-person-details-data dark:text-person-details-data font-normal">{gender}</span></p>
                    <p>Profession: <span className="text-light-person-details-data dark:text-person-details-data font-normal">{profession}</span></p>
                    <p>Birth Place: <span className="text-light-person-details-data dark:text-person-details-data font-normal">{birthPlace}</span></p>
                    <p>Popularity: <span className="text-light-person-details-data dark:text-person-details-data font-normal">{popularity}</span></p>
                    <p>Known For: <span className="text-light-person-details-data dark:text-person-details-data font-normal">{knownFor}</span></p>
                </div>
            </div>
        </div>
    );
}