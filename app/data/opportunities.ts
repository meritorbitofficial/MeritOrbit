export let opportunities: any[] = [];

export function addOpportunity(data: any) {
  opportunities.push(data);
  console.log("Added:", opportunities); // 👈 important
}