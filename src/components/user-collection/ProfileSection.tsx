import Image from "next/image";
import { cookies } from "next/headers";
import {
  MdOutlineFavorite,
  MdStars,
} from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import { IoIosListBox } from "react-icons/io";
import {
  getAccountDetails,
  getAccountSummaryCounts,
  getTmdbAvatarUrl,
  type TmdbAccountStats,
} from "@/lib/tmdb/auth";

const SESSION_COOKIE_NAME = "tmdb_session_id";

interface ProfileSectionProps {
  param?: string;
}

export async function ProfileSection({ param }: ProfileSectionProps) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  let user = null;
  let stats: TmdbAccountStats = {
    favorites: 0,
    watchlist: 0,
    ratings: 0,
    lists: 0,
  };

  if (sessionId) {
    try {
      user = await getAccountDetails(sessionId);
      if (user?.id) {
        stats = await getAccountSummaryCounts(sessionId, user.id);
      }
    } catch {
      // Fallback if session fails or is invalid
    }
  }

  // Determine user info dynamically from TMDB account or fallback to URL param
  const displayName =
    user?.name ||
    user?.username ||
    (param
      ? param
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")
      : "Salman Farsy");

  const avatarUrl = user ? getTmdbAvatarUrl(user) : "/assets/persons-image.jpg";

  return (
    <div className="w-full bg-light-dropdown dark:bg-dropdown rounded-2xl md:rounded-3xl mt-6 sm:mt-8 p-6 sm:p-8 md:p-12 transition-colors">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-20">
        {/* User Identity Section */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-[100px] h-[100px] xl:w-[150px] xl:h-[150px] lg:w-[140px] lg:h-[140px] md:w-[130px] md:h-[130px] sm:w-[115px] sm:h-[115px] rounded-full border-2 border-black/15 dark:border-white/30 overflow-hidden shadow-md">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                fill
                sizes="(max-width: 700px) 100px, (max-width: 900px) 130px, 150px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-trails-red to-trails-blue text-white font-akshar text-3xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <p className="mt-3 sm:mt-4 font-inter font-semibold text-[17px] sm:text-[18px] md:text-[19px] xl:text-[21px] text-black dark:text-white text-center">
            {displayName}
          </p>

          <a
            href="https://www.themoviedb.org/settings/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-black hover:bg-black/85 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black font-poppins font-semibold text-xs sm:text-sm md:text-base rounded-full transition-all duration-150 active:scale-95 shadow-sm text-center"
          >
            Update Profile
          </a>
        </div>

        {/* Stats Grid */}
        <div className="w-full md:w-auto flex-1 flex justify-center md:justify-end">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-14 font-inter">
            {/* Favorites Stat */}
            <div className="flex flex-col items-center justify-start gap-2.5 sm:gap-3.5">
              <p className="text-xs sm:text-sm md:text-base text-light-user-states dark:text-user-states font-medium text-center whitespace-nowrap">
                Favorites Count
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MdOutlineFavorite className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500 shrink-0" />
                <span className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl text-black dark:text-white">
                  {stats.favorites}
                </span>
              </div>
            </div>

            {/* Watchlist Stat */}
            <div className="flex flex-col items-center justify-start gap-2.5 sm:gap-3.5">
              <p className="text-xs sm:text-sm md:text-base text-light-user-states dark:text-user-states font-medium text-center whitespace-nowrap">
                Watchlist Count
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <BsPinAngleFill className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black dark:text-white shrink-0" />
                <span className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl text-black dark:text-white">
                  {stats.watchlist}
                </span>
              </div>
            </div>

            {/* Ratings Stat */}
            <div className="flex flex-col items-center justify-start gap-2.5 sm:gap-3.5">
              <p className="text-xs sm:text-sm md:text-base text-light-user-states dark:text-user-states font-medium text-center whitespace-nowrap">
                Ratings Count
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MdStars className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black dark:text-yellow-300 shrink-0" />
                <span className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl text-black dark:text-white">
                  {stats.ratings}
                </span>
              </div>
            </div>

            {/* Lists Stat */}
            <div className="flex flex-col items-center justify-start gap-2.5 sm:gap-3.5">
              <p className="text-xs sm:text-sm md:text-base text-light-user-states dark:text-user-states font-medium text-center whitespace-nowrap">
                Lists Count
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IoIosListBox className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500 shrink-0" />
                <span className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl text-black dark:text-white">
                  {stats.lists}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
