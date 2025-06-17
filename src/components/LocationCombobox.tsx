import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { LocationFeature, PhotonFeature } from '@/types/types';

interface LocationComboboxProps {
  value: LocationFeature | null;
  onChange: (value: LocationFeature | null) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const LocationCombobox: React.FC<LocationComboboxProps> = ({
  value,
  onChange,
  placeholder,
  icon,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [locations, setLocations] = useState<LocationFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to format the location label
  const getLocationLabel = (feature: LocationFeature) => {
    const props = feature.properties;
    return [props.name, props.city, props.state, props.country, props.postcode]
      .filter(Boolean)
      .join(', ');
  };

  // Fetch locations from Photon API
  useEffect(() => {
    const fetchLocations = async () => {
      if (searchValue.length < 2) {
        setLocations([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await axios.get('https://photon.komoot.io/api/', {
          params: {
            q: searchValue,
            limit: 10,
          },
        });

        const seen = new Set<string>();
        const results: LocationFeature[] = res.data.features
          .filter(
            (f: PhotonFeature) =>
              Array.isArray(f.geometry?.coordinates) &&
              f.geometry.coordinates.length === 2
          )
          .filter((f: PhotonFeature) => {
            // Create a unique string for each location to filter duplicates
            const props = f.properties;
            const label = [props.name, props.city, props.state, props.country, props.postcode]
              .filter(Boolean)
              .join(', ');
            if (seen.has(label)) return false;
            seen.add(label);
            return true;
          });

        setLocations(results);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setLocations([]);
      }
      setIsLoading(false);
    };

    fetchLocations();
  }, [searchValue]);

  const handleSelect = (selectedFeature: LocationFeature) => {
    onChange(selectedFeature);
    setOpen(false);
    setSearchValue('');
  };

  const handleInputChange = (inputValue: string) => {
    setSearchValue(inputValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-trucking-200 focus:border-trucking-500 h-10"
        >
          <div className="flex items-center gap-2 flex-1 text-left">
            {icon}
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value ? getLocationLabel(value) : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 min-w-[var(--radix-popover-trigger-width)] w-[var(--radix-popover-trigger-width)]"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>
              <div className="p-4 text-center text-sm">
                {searchValue && (
                  <div>
                    <p className="text-muted-foreground mb-2">
                      {isLoading ? 'Searching...' : 'No results found'}
                    </p>
                    {!isLoading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="text-trucking-600"
                      >
                        Use "{searchValue}"
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {locations.map((location) => {
                const label = getLocationLabel(location);
                return (
                  <CommandItem
                    key={label + JSON.stringify(location.geometry.coordinates)}
                    value={label}
                    onSelect={() => handleSelect(location)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        value && getLocationLabel(value) === label &&
                        JSON.stringify(value.geometry.coordinates) === JSON.stringify(location.geometry.coordinates)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="whitespace-pre-line">{label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationCombobox;