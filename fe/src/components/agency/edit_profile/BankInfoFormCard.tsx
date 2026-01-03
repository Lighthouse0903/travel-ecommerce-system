"use client";

import React from "react";
import { Landmark, CreditCard, UserRound } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { EditAgencyFormValues } from "@/types/agency";

interface Props {
  isSubmitting: boolean;
}

const BankInfoFormCard: React.FC<Props> = ({ isSubmitting }) => {
  const { control } = useFormContext<EditAgencyFormValues>();

  return (
    <Card className="rounded-xl bg-slate-50 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5" />
          Ngân hàng
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Landmark className="h-4 w-4" /> Ngân hàng
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bank_account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Số tài khoản
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bank_account_holder"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <UserRound className="h-4 w-4" /> Chủ tài khoản
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BankInfoFormCard;
