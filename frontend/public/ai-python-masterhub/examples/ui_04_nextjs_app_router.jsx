// file: app/todos/page.tsx  (Server Component by default — zero JS shipped)
import { db } from "@/lib/db";

export const revalidate = 60;                 // ISR-ish cache for this page

async function getTodos() {
  return db.todo.findMany({ orderBy: { id: "desc" }, take: 20 });
}

export default async function TodosPage() {
  const todos = await getTodos();             // fetch directly, no useEffect!
  return (
    <main>
      <h1>Todos</h1>
      <AddTodo />                             {/* client island below */}
      <ul>{todos.map(t =>
        <li key={t.id}>{t.done ? "✅" : "⬜"} {t.title}</li>)}
      </ul>
    </main>
  );
}

// file: app/todos/add.tsx  ("use client" = smallest possible island)
"use client";
import { useRef } from "react";
import { addTodo } from "./actions";

export function AddTodo() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form action={async fd => {                // Server Action call
      await addTodo(fd.get("title") as string);
      ref.current!.value = "";
    }}>
      <input ref={ref} name="title" required placeholder="new todo…" />
      <button>add</button>
    </form>
  );
}

// file: app/todos/actions.ts  ('use server' mutations)
"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addTodo(title: string) {
  await db.todo.create({ data: { title } });
  revalidatePath("/todos");                   // refresh cached page data
}

// file: app/api/todos/route.ts  (Route Handler REST endpoint)
// export async function GET() {
//   return Response.json(await db.todo.findMany());
// }