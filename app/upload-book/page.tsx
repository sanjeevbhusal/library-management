"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { Book } from "@/drizzle/types";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  image: z.instanceof(File).refine((file) => {
    if (!file.name) return false;
    return true;
  }, "Image is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      author: "",
      category: "",
      image: new File([], ""),
    },
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(values: FormValues) {
    try {
      const response = await axios.post("/api/upload-book", {
        name: values.name,
        author: values.author,
        category: values.category,
        imageUrl: "dkfdkfd",
      });
      const { bookId } = response.data as { bookId: Book["id"] };
      toast({
        description: "Book uploaded successfully",
      });
      form.reset();
      router.push(`/books/${bookId}`);
    } catch (e) {
      const error = e as AxiosError<any, any>;
      // console.log(error);
      const statusCode = error.response?.status;
      console.log("==>", statusCode);

      switch (statusCode) {
        case 409: {
          form.setError("name", {
            message:
              "Book with this name already exists. Please choose a different name ",
          });
          break;
        }
        default: {
          toast({
            description: "Something went wrong. Please try again later",
            variant: "destructive",
          });
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-4 lg:py-8 lg:px-16 mt-16 gap-8">
      <h1 className="font-medium text-base lg:text-2xl">Upload Book</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                    type="file"
                    onChange={(e) =>
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.isSubmitting ? (
            <Button type="submit" disabled={true}>
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button type="submit">Upload</Button>
          )}
        </form>
      </Form>
    </div>
  );
}
