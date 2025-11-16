// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   MoreHorizontal,
//   Pencil,
//   Trash2,
//   Eye,
//   MapPinCheck,
//   Calendar,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { TourListPageType } from "@/types/tour";

// interface TourCardProps {
//   tour: TourListPageType;
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
//   onView?: (id: string) => void;
// }

// const TourCard: React.FC<TourCardProps> = ({
//   tour,
//   onEdit,
//   onDelete,
//   onView,
// }) => {
//   const imageSrc =
//     tour.image_urls && tour.image_urls.length > 0
//       ? tour.image_urls
//       : "/placeholder.jpg";

//   return (
//     <Card className="relative group w-full bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
//       {/* Ảnh tour */}
//       <div className="relative w-full h-44">
//         <Image
//           src={imageSrc}
//           alt={tour.name}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-105"
//           sizes="500px"
//         />
//       </div>

//       {/* Menu hành động */}
//       <div className="absolute top-2 right-2">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 text-gray-600 hover:bg-gray-100"
//             >
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <Link href={`/agency/dashboard/tours/${tour.tour_id}`}>
//               <DropdownMenuItem onClick={() => onView?.(tour.tour_id)}>
//                 <Eye className="w-4 h-4 mr-2 text-green-600" /> Xem chi tiết
//               </DropdownMenuItem>
//             </Link>
//             <DropdownMenuItem onClick={() => onEdit?.(tour.tour_id)}>
//               <Pencil className="w-4 h-4 mr-2 text-blue-600" /> Sửa
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => onDelete?.(tour.tour_id)}
//               className="text-red-600 focus:text-red-700"
//             >
//               <Trash2 className="w-4 h-4 mr-2" /> Xóa
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Nội dung */}
//       <CardContent className="p-4 space-y-2">
//         <h2 className="text-base font-semibold line-clamp-1">{tour.name}</h2>
//         <p className="text-gray-500 text-sm line-clamp-2">{tour.description}</p>

//         {/* Danh mục */}
//         {tour.categories && tour.categories.length > 0 && (
//           <div className="flex flex-wrap gap-1 mt-1">
//             {tour.categories.map((cat, idx) => (
//               <span
//                 key={idx}
//                 className="px-2 py-0.5 bg-pink-50 text-pink-600 text-xs rounded-full"
//               >
//                 {cat}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Thông tin phụ */}
//         <div className="flex justify-between text-sm text-gray-600 mt-2">
//           <div className="flex items-center gap-1">
//             <MapPinCheck size={16} /> {tour.destination}
//           </div>
//           <div className="flex items-center gap-1">
//             <Calendar size={16} /> {tour.duration_days}N
//           </div>
//         </div>

//         {/* Giá */}
//         <div className="mt-2">
//           {tour.discount_price ? (
//             <>
//               <span className="text-pink-600 font-bold">
//                 {tour.discount_price.toLocaleString()}₫
//               </span>
//               <span className="text-gray-400 text-xs line-through ml-2">
//                 {tour.price.toLocaleString()}₫
//               </span>
//             </>
//           ) : (
//             <span className="text-pink-600 font-bold">
//               {tour.price.toLocaleString()}₫
//             </span>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default TourCard;
