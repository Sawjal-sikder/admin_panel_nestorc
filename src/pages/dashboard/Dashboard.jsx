import React from "react";
import { CgProfile } from "react-icons/cg";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { Link } from "react-router-dom";
import XPTrendsChart from "../../components/XPTrendsChart";
import UserChart from "../../components/UserChart";

function Dashboard() {
  const demoData = {
    total_user: "12,530",
    daily_xp: "3,530",
    completed_tasks: "12,530",
    revenue: "3,530",
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FE7400] text-[#F3F3F3] border-[1px] border-[#7ED321] h-[200px] w-[350px] rounded-[10px] text-center py-5">
          <div className="flex justify-center my-2">
            <CgProfile className="text-[40px] text-center" />
          </div>
          <h4 className="text-[25px]">Total User</h4>
          <h1 className="text-[30px] font-bold mt-3">{demoData.total_user}</h1>
        </div>

        <div className="bg-[#FE7400] text-[#F3F3F3] border-[1px] border-[#7ED321] h-[200px] w-[350px] rounded-[10px] text-center py-5">
          <div className="flex justify-center my-2">
            <GiConfirmed className="text-[40px] text-center" />
          </div>
          <h4 className="text-[25px]">Daily XP</h4>
          <h1 className="text-[30px] font-bold mt-3">{demoData.daily_xp}</h1>
        </div>

        <div className="bg-[#FE7400] text-[#F3F3F3] border-[1px] border-[#7ED321] h-[200px] w-[350px] rounded-[10px] text-center py-5">
          <div className="flex justify-center my-2">
            <GiConfirmed className="text-[40px] text-center" />
          </div>
          <h4 className="text-[25px]">Completed Tasks</h4>
          <h1 className="text-[30px] font-bold mt-3">
            {demoData.completed_tasks}
          </h1>
        </div>

        <div className="bg-[#FE7400] text-[#F3F3F3] border-[1px] border-[#7ED321] h-[200px] w-[350px] rounded-[10px] text-center py-5">
          <div className="flex justify-center my-2">
            <AiOutlineDollarCircle className="text-[40px] text-center" />
          </div>
          <h4 className="text-[25px]">Revenue</h4>
          <h1 className="text-[30px] font-bold mt-3">{demoData.revenue}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
        <UserChart />
        <XPTrendsChart />
      </div>

      {/* <div className="flex justify-between my-5">
        <h1 className="text-[32px] font-semibold">Recently Flagged Reports</h1>
        <Link className="text-[16px] font-semibold" to="/#">
          View All
        </Link>
      </div>

      <div className="flex justify-between my-3">
        <p className="text-[16px]">A new user has applied for gold membership packages and waiting for approval, review the application for approval or</p>
        <Link className="text-[16px] text-[#999999]" to="/#">
          Just Now
        </Link>
      </div>

      <div className="flex justify-between my-3">
        <p className="text-[16px]">A new user has applied for gold membership packages and waiting for approval, review the application for approval or</p>
        <Link className="text-[16px] text-[#999999]" to="/#">
          Just Now
        </Link>
      </div> */}
    </div>
  );
}

export default Dashboard;
