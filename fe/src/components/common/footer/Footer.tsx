"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  const [email, setEmail] = useState("");
  const handleClick = (e: any) => {
    e.preventDefault();
    console.log(email);
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full bg-slate-600 py-2">
        <div className="w-[90%] flex flex-col md:flex-row gap-y-0 items-center justify-between gap-4">
          {/* Social media */}
          <div className="w-full md:w-[30%] flex items-center justify-around md:justify-center pt-5 gap-4">
            <FaFacebook size={30} />
            <FaInstagram size={30} />
            <FaTwitter size={30} />
            <FaYoutube size={30} />
          </div>
          {/* Nhập email nhận ưu đãi */}
          <div className="flex flex-col md:flex-row w-[90vw] md:w-full flex-1 items-center justify-around p-4 gap-4">
            <div className="flex flex-col items-start justify-between text-center md:text-left">
              <h1 className="text-[23px] text-slate-300">Đăng kí nhận tin</h1>
              <p className="text-slate-300 text-[15px]">
                Các deal du lịch giảm giá đến 60% sẽ được gửi đến bạn
              </p>
            </div>
            <div className="flex w-full md:max-w-sm items-center gap-2">
              <Input
                type="email"
                placeholder="Địa chỉ email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="outline" onClick={handleClick}>
                Đăng kí
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[90%]">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full flex flex-col md:flex-row"
          >
            <ResizablePanel
              defaultSize={30}
              className="flex flex-col items-center justify-around p-5 bg-slate-700 w-full md:w-[30%]"
            >
              {/* Logo */}
              <div>
                <div className="flex justify-center items-center">
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <Image
                      src="/images/logo.jpg"
                      alt="Logo"
                      width={50}
                      height={50}
                    />
                  </div>
                  <span className="font-heading text-xl text-white font-serif hidden sm:flex">
                    VietTravel
                  </span>
                </div>
                <div className="text-white mb-6 font heading hidden sm:flex">
                  Khám phá Việt Nam cùng chúng tôi
                </div>
              </div>

              <div className="w-[90%] text-slate-300 text-[15px] text-center md:text-left">
                <p>Địa chỉ: 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội</p>

                <p>Giờ hoạt động: Đã đóng cửa </p>
                <p>Số điện thoại: 024 3756 2186</p>
                <p>Hotline: 1900 9999</p>
                <p>Email: support@viettravel.vn</p>
              </div>
            </ResizablePanel>

            <ResizablePanel
              defaultSize={70}
              className="flex flex-col w-full md:w-[70%]"
            >
              <ResizablePanelGroup
                direction="vertical"
                className="flex flex-col w-full"
              >
                {/* ✅ Responsive grid 2x2 khi nhỏ hơn sm */}
                <ResizablePanel
                  defaultSize={90}
                  className="flex flex-wrap sm:flex-nowrap w-full"
                >
                  <div className="grid grid-cols-2 sm:flex sm:flex-row w-full">
                    <ResizablePanel
                      defaultSize={25}
                      className="flex flex-col justify-center items-start w-full sm:w-1/2 lg:w-1/4"
                    >
                      <div className="flex flex-col justify-between items-baseline mx-3 h-[70%] mb-4 md:mb-0">
                        <h1 className="font-semibold text-white">
                          Về chúng tôi
                        </h1>
                        <div className="flex flex-col justify-around items-start text-gray-300 font-thin text-sm gap-y-2">
                          <p>
                            <Link href="/">Trang chủ</Link>
                          </p>
                          <p>
                            <Link href="#">Giới thiệu</Link>
                          </p>
                          <p>
                            <Link href="#">Danh mục tour</Link>
                          </p>
                          <p>
                            <Link href="#">Khuyến mãi</Link>
                          </p>
                          <p>
                            <Link href="#">FAQ</Link>
                          </p>
                          <p>
                            <Link href="#">Liên hệ</Link>
                          </p>
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizablePanel
                      defaultSize={25}
                      className="flex flex-col justify-center items-start w-full sm:w-1/2 lg:w-1/4"
                    >
                      <div className="flex flex-col justify-between items-baseline mx-3 h-[70%] mb-4 md:mb-0">
                        <h1 className="font-semibold text-white">
                          Tour miền Bắc
                        </h1>
                        <div className="flex flex-col justify-around items-start text-gray-300 font-thin text-sm gap-y-2">
                          <p>
                            <Link href="#">Sapa</Link>
                          </p>
                          <p>
                            <Link href="#">Hà Giang</Link>
                          </p>
                          <p>
                            <Link href="#">Cao Bằng - Bắc Kạn</Link>
                          </p>
                          <p>
                            <Link href="#">Ninh Bình</Link>
                          </p>
                          <p>
                            <Link href="#">Hạ Long</Link>
                          </p>
                          <p>
                            <Link href="#">Cát Bà</Link>
                          </p>
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizablePanel
                      defaultSize={25}
                      className="flex flex-col justify-center items-start w-full sm:w-1/2 lg:w-1/4"
                    >
                      <div className="flex flex-col justify-between items-baseline mx-3 h-[70%] mb-4 md:mb-0">
                        <h1 className="font-semibold text-white">
                          Tour miền Trung
                        </h1>
                        <div className="flex flex-col justify-around items-start text-gray-300 font-thin text-sm gap-y-2">
                          <p>
                            <Link href="/">Trang chủ</Link>
                          </p>
                          <p>
                            <Link href="#">Giới thiệu</Link>
                          </p>
                          <p>
                            <Link href="#">Danh mục tour</Link>
                          </p>
                          <p>
                            <Link href="#">Khuyến mãi</Link>
                          </p>
                          <p>
                            <Link href="#">FAQ</Link>
                          </p>
                          <p>
                            <Link href="#">Liên hệ</Link>
                          </p>
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizablePanel
                      defaultSize={25}
                      className="flex flex-col justify-center items-start w-full sm:w-1/2 lg:w-1/4"
                    >
                      <div className="flex flex-col justify-between items-baseline mx-3 h-[70%]">
                        <h1 className="font-semibold text-white">
                          Tour miền Nam
                        </h1>
                        <div className="flex flex-col justify-around items-start text-gray-300 font-thin text-sm gap-y-2">
                          <p>
                            <Link href="/">Phú Quốc</Link>
                          </p>
                          <p>
                            <Link href="#">Côn Đảo</Link>
                          </p>
                          <p>
                            <Link href="#">Bến Tre</Link>
                          </p>
                          <p>
                            <Link href="#">Cần Thơ</Link>
                          </p>
                          <p>
                            <Link href="#">Kiên Giang</Link>
                          </p>
                          <p>
                            <Link href="#">Cà Mau</Link>
                          </p>
                        </div>
                      </div>
                    </ResizablePanel>
                  </div>
                </ResizablePanel>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />

                <ResizablePanel
                  defaultSize={10}
                  className="flex justify-center items-center text-gray-300 text-[13px] py-2"
                >
                  @Copy 2025 VietTravel
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
};
export default Footer;
