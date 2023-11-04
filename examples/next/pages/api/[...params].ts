import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json("here");
// }
export default function handler(req: any, res: any) {
  res.status(200).json("hi");
}
