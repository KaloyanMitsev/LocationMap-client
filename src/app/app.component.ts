import { Component, Inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { latLng } from 'leaflet';
import { MapService } from './app.service';
import { Subscription, concat } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  options = {
    layers: [],
    zoom: 1,
    center: latLng(46.879966, -121.726909),
  };

  layers: L.Layer[] = [];
  currentLayer?: L.Layer;
  map?: L.Map;
  location?: string;
  isOverlay: boolean = false;

  private subscriptions?: Subscription;

  constructor(@Inject(MapService) private mapService: MapService) {}

  ngAfterViewInit() {
    this.map = L.map('map', this.options);
  }

  ngOnInit() {
    const layer1$ = this.mapService.getLayer1();
    const layer2$ = this.mapService.getLayer2();

    this.subscriptions = concat(layer1$, layer2$).subscribe(
      (blob) => {
        const imageUrl = URL.createObjectURL(blob);
        const imageBounds: L.LatLngBoundsLiteral = [
          [-90, -180],
          [90, 180],
        ];

        const layer = L.imageOverlay(imageUrl, imageBounds);
        layer.setOpacity(0.5);
        this.layers.push(layer);
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
  }

  switchLayer(layer: L.Layer) {
    if (this.currentLayer && !this.isOverlay) {
      this.map?.removeLayer(this.currentLayer);
    }
    this.currentLayer = layer;
    this.map?.addLayer(this.currentLayer);
  }

  searchLocation() {
    const searchSubscription = this.mapService
      .search(this.location)
      .subscribe((data) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          (this.map as L.Map).setView([lat, lon], 3);
        } else {
          alert('Location not found');
        }
      });

    this.subscriptions?.add(searchSubscription);
  }

  toggleLayer(target: any) {
    this.isOverlay = target.checked;
  }
}
