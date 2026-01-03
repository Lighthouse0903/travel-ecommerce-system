"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Section from "./Section";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { EditTourFormValues } from "@/types/tour";

const ServicesPriceSection: React.FC = () => {
  const { control } = useFormContext<EditTourFormValues>();

  // FieldArray: transportation
  const transportFA = useFieldArray({
    control,
    name: "transportation",
  });

  // FieldArray: services_included
  const includedFA = useFieldArray({
    control,
    name: "services_included",
  });

  // FieldArray: services_excluded
  const excludedFA = useFieldArray({
    control,
    name: "services_excluded",
  });

  return (
    <Section
      title="Dịch vụ & Giá"
      description="Cập nhật giá tour và các dịch vụ/tiện ích đi kèm."
    >
      <div className="space-y-6">
        {/* PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="adult_price"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Giá người lớn</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value === undefined ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="children_price"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Giá trẻ em</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value === undefined ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="discount"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Giảm giá (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0 - 100"
                    value={field.value === undefined ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* LISTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transportation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Phương tiện di chuyển</h3>
                <p className="text-sm text-muted-foreground">
                  VD: Xe limousine, Tàu hoả...
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => transportFA.append("")}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm
              </Button>
            </div>

            <div className="space-y-2">
              {transportFA.fields.map((f, idx) => (
                <div key={f.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`transportation.${idx}` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Nhập phương tiện..."
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => transportFA.remove(idx)}
                    aria-label="Xoá"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* lỗi validate array (min(1)) */}
              <FormField
                control={control}
                name="transportation"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Services included */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dịch vụ bao gồm</h3>
                <p className="text-sm text-muted-foreground">
                  Những gì đã có trong tour
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => includedFA.append("")}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm
              </Button>
            </div>

            <div className="space-y-2">
              {includedFA.fields.map((f, idx) => (
                <div key={f.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`services_included.${idx}` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Nhập dịch vụ bao gồm..."
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => includedFA.remove(idx)}
                    aria-label="Xoá"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <FormField
                control={control}
                name="services_included"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Services excluded */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dịch vụ không bao gồm</h3>
                <p className="text-sm text-muted-foreground">
                  Những gì khách tự chi trả
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => excludedFA.append("")}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm
              </Button>
            </div>

            <div className="space-y-2">
              {excludedFA.fields.map((f, idx) => (
                <div key={f.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`services_excluded.${idx}` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Nhập dịch vụ không bao gồm..."
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => excludedFA.remove(idx)}
                    aria-label="Xoá"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <FormField
                control={control}
                name="services_excluded"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ServicesPriceSection;
